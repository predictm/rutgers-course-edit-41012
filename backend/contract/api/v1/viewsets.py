from datetime import datetime
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from appointment.models import Appointment, Instructor
from contract.models import Contract, ContractTemplate
from contract.tasks import mark_contract_as_signed
from course.models import Semester
from general.cache_helper import CacheHelper
from general.enum_helper import AppointmentStatus, ContractStatus, ContractTemplateType, TermType
from .serializers import ContractSerializer, ContractTemplateSerializer, DocuSignRequestSerializer
from general.permissions import IsAdmin
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from django.db import transaction
import requests
import base64
from general.docusign_helper import DocuSignOperations
from general.docusign_token import generate_docusign_token
from rest_framework.permissions import AllowAny
from django.utils import timezone
from django.shortcuts import get_object_or_404


class ContractTemplateViewSet(viewsets.ModelViewSet):
    """
    A viewset for managing contract templates.

    This viewset provides CRUD operations for contract templates.
    It also includes additional actions such as resetting a template to its default state.

    Attributes:
        queryset (QuerySet): The queryset of ContractTemplate objects.
        serializer_class (Serializer): The serializer class for ContractTemplate objects.
        permission_classes (list): The list of permission classes for the viewset.

    Methods:
        get_queryset(): Returns the queryset of ContractTemplate objects.
        reset_to_default(request, pk=None): Resets a contract template to its default state.
        perform_create(serializer): Performs additional actions when creating a contract template.
        perform_update(serializer): Performs additional actions when updating a contract template.
    """
    queryset = ContractTemplate.objects.all()
    serializer_class = ContractTemplateSerializer
    permission_classes = [IsAuthenticated, IsAdmin]

    def get_queryset(self):
        """
        Returns the queryset of ContractTemplate objects.

        This method retrieves distinct contract types and filters the queryset based on the active templates.
        The templates are ordered by modified_at field.

        Returns:
            QuerySet: The filtered and ordered queryset of ContractTemplate objects.
        """
        distinct_types = ContractTemplate.objects.order_by('template_type').values('template_type').distinct()
        queryset = ContractTemplate.objects.none()
        for contract_type in distinct_types:
            queryset |= ContractTemplate.objects.filter(template_type=contract_type['template_type'], is_active=True).order_by('modified_at')
        return queryset

    @action(detail=True, methods=['post'], permission_classes=[IsAdmin], url_path='reset-to-default')
    def reset_to_default(self, request, pk=None):
        """
        Resets a contract template to its default state.

        This action resets the specified contract template to its default state.
        It calls the reset_to_default method of the ContractTemplate model.

        Args:
            request (Request): The HTTP request object.
            pk (int): The primary key of the contract template.

        Returns:
            Response: The response message indicating the template has been reset to default.
        """
        contract_template = self.get_object()
        contract_template.reset_to_default()
        return Response({'response_message': 'template reset to default'})
    
    def perform_create(self, serializer):
        """
        Performs additional actions when creating a contract template.

        This method sets the modified_by field of the contract template to the current user.

        Args:
            serializer (Serializer): The serializer instance for the contract template.
        """
        serializer.save(modified_by=self.request.user)

    def perform_update(self, serializer):
        """
        Performs additional actions when updating a contract template.

        This method sets the modified_by field of the contract template to the current user.

        Args:
            serializer (Serializer): The serializer instance for the contract template.
        """
        serializer.save(modified_by=self.request.user)


class InstructorContractView(APIView):
    """
    API view for retrieving and creating contracts for an instructor.

    This view allows users to retrieve the contract for a specific instructor by providing the instructor's ID.
    The contract is retrieved based on the latest active contract associated with the instructor.
    If no active contract is found, the view returns the contract associated with the latest approved appointment.

    Supported HTTP Methods:
        - GET: Retrieves the contract for the specified instructor.

    Query Parameters:
        - id (int, required): The ID of the instructor.

    Returns:
        Response: The contract data in the response body.

    Example Usage:
        GET /instructor/id=123/
    """
    @transaction.atomic
    def get(self, request, id=None):
        """
        Retrieves the contract for the specified instructor.

        Args:
            request (HttpRequest): The HTTP request object.
            id (int, optional): The ID of the instructor. Defaults to None.

        Returns:
            Response: The contract data in the response body.
        """
        instructor = get_object_or_404(Instructor, id=id)

        contract = Contract.objects.filter(instructor=instructor, is_active=True).order_by('-created_at').first()
        if contract:
            serializer = ContractSerializer(contract)
            return Response(serializer.data)

        current_semester = Semester.objects.filter(is_current_semester=True).first()
        appointments = Appointment.objects.filter(
            instructor=instructor,
            approved=True,
            is_assigned=True,
            course_section__year=current_semester.year,
            course_section__term=current_semester.term,
            appointment_status=AppointmentStatus.APPROVED
        ).order_by('-created_at')

        if not appointments:
            return Response({'response_message': 'No contract available'}, status=status.HTTP_400_BAD_REQUEST)

        first_appointment = appointments.first()
        contract_template = ContractTemplate.objects.filter(
            template_type=ContractTemplateType.UNION_CONTRACT if first_appointment.primary_instructor and first_appointment.instr_app_job_class_code.code in ['93000', '93001', '93002']
            else ContractTemplateType.ON_LOAD_CONTRACT if first_appointment.primary_instructor and first_appointment.instr_app_job_class_code.code == '00000'
            else ContractTemplateType.NON_UNION_CONTRACT,
            is_active=True
        ).first()

        if not contract_template:
            return Response({'response_message': 'No contract template available'}, status=status.HTTP_400_BAD_REQUEST)

        contract = Contract.objects.create(
            instructor=instructor,
            contract_template=contract_template,
            is_active=True
        )
        contract.appointments.set(appointments)
        contract.save()
        
        serializer = ContractSerializer(contract)
        return Response(serializer.data)

    def _replace_contract_tokens(contract:Contract):
        """
        Replaces contract tokens with their corresponding values.

        Args:
            contract (Contract): The contract object.
        """
        pass

    def _get_contract_tokens(contract:Contract):
        """
        Retrieves the contract tokens from the contract template.

        Args:
            contract (Contract): The contract object.

        Returns:
            dict: The dictionary of contract tokens and their corresponding values.
        """
        contact_template = contract.contract_template
        contract_tokens = {}
        # TODO: Add send_for_signature_date instead of current date if its value is not null
        contract_tokens['current_date'] = datetime.now().strftime('%B %d, %Y')
        contract_tokens['instructor_name'] = contract.instructor.first_name + ' ' + contract.instructor.last_name
        contract_tokens['instructor_email'] = contract.instructor.email
        contract_tokens['first_name'] = contract.instructor.first_name
        contract_tokens['last_name'] = contract.instructor.last_name
        contract_tokens['address1'] = contract.instructor.address1
        contract_tokens['address2'] = contract.instructor.address2
        contract_tokens['city'] = contract.instructor.city
        contract_tokens['state'] = contract.instructor.state
        contract_tokens['zip_code'] = contract.instructor.zip_code
        contract_tokens['term_desc'] = contract.appointments.first().course_section.term.descriptive_name
        contract_tokens['semester_year'] = contract.appointments.first().course_section.year
        contract_tokens['appointments'] = []
        for appointment in contract.appointments.all():
            appointment_tokens = {}
            appointment_tokens['course_title'] = appointment.course_section.course.title
            appointment_tokens['course_number'] = appointment.course_section.course.course_number
        return contract_tokens


class DocuSignWebhookViewSet(viewsets.ViewSet):
    """
    Viewset to handle webhook events from DocuSign signing events.
    """
    @action(detail=False, methods=['post'], url_path='webhook', permission_classes=[AllowAny])
    def webhook(self, request):
        """
        Endpoint to handle webhook events from DocuSign signing events.
        """
        # Process the webhook event data
        event_data = request.data
        if request.data['event'] == 'envelope-completed':
            document_string = event_data['data']['envelopeSummary']['envelopeDocuments'][0]['PDFBytes']
            envelope_id = event_data['data']['envelopeId']
            mark_contract_as_signed.delay(document_string, envelope_id)
        return Response({'response_message': 'Webhook event processed successfully'})
    
    @action(detail=False, methods=['post'], url_path='send-for-signature')
    def send_for_signature(self, request):
        try:
            # Get the access token using JWT grant type
            token = self.create_jwt_grant_token()
            if not token:
                return Response({'error': 'Internal Key Error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            post_data = {
                'grant_type': 'urn:ietf:params:oauth:grant-type:jwt-bearer',
                'assertion': token
            }
            base_url = "https://account-d.docusign.com/oauth/token"
            r = requests.post(base_url, data=post_data)
            token_data = r.json()
            # Validate and deserialize the request data
            serializer = DocuSignRequestSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            validated_data = serializer.validated_data

            # Read document content
            base64_file_content = base64.b64encode(bytes(validated_data['html_document'], "utf-8")).decode("ascii")
            contract = validated_data['contract_id']
            instructor_name = contract.instructor.first_name + " " + contract.instructor.last_name
            instructor_email = contract.instructor.primary_email
            # Determine signer type and call corresponding function
            email_subject = self.get_email_subject(contract)
            email_body = self.get_email_body(contract)
            if validated_data['type'] == 'email':
                res = DocuSignOperations().signature_by_email(token_data, base64_file_content,
                                              instructor_name, instructor_email, email_subject, email_body)
            else:
                res = {'error': 'Invalid signer type'}

            if res.get('error'):
                return Response(res, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            contract.envelope_id = res.get('envelope_id')
            contract.status = ContractStatus.SEND_FOR_SIGNATURE.value
            contract.date_send_for_signature = timezone.now()
            contract.send_for_signature_by = request.user
            contract.save()
            return Response(res, status=status.HTTP_200_OK)

        except Exception as e:
            # Log the exception for debugging purposes
            # logger.error('In docusign_signature: %s', str(e))
            return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def create_jwt_grant_token(self):
        try:
            docusign_token = CacheHelper.get_from_cache('docusign_token')
            if not docusign_token:
                docusign_token = generate_docusign_token()
            return docusign_token
        except ValueError:
            return None
    
    def get_email_subject(self, contract):
        semester = Semester.objects.filter(is_current_semester=True).first()
        term = TermType(semester.term).display_name()
        year = semester.year
        last_name = contract.instructor.last_name.capitalize()
        first_name = contract.instructor.first_name.capitalize()
        offering_unit_cd = contract.appointments.first().course_section.offering_unit_cd
        subj_cd = contract.appointments.first().course_section.subj_cd
        subject = f"{term} {year} - {last_name}, {first_name} {offering_unit_cd}:{subj_cd}"
        if contract.previous_contract:
            count = 0
            previous_contract = contract.previous_contract
            while previous_contract:
                count += 1
                previous_contract = previous_contract.previous_contract
            subject += f"  R{count}"
        return subject
    
    def get_email_body(self, contract):
        semester = Semester.objects.filter(is_current_semester=True).first()
        term = TermType(semester.term).display_name()
        year = semester.year
        last_name = contract.instructor.last_name.capitalize()
        first_name = contract.instructor.first_name.capitalize()

        return f"""Dear {first_name} {last_name}, 

    Thank you for participating in {term} {year}. Attached is your contract with your {term} assignment(s) and salary. Please review this information for any discrepancies in salary, course assignment(s), meeting dates, time, and location.

    You may verify the course information on the Scheduling website at http://sis.rutgers.edu/soc/. Please sign your contract using the DocuSign feature within 3 days of receiving it so that your payroll can be prepared. Your signed contract is needed to process your payment. You do not need to have a DocuSign account to use this feature. 

    Please follow the steps below to sign your contract: 
    1. You will receive an email with the subject line “Complete with DocuSign, your last and first name and your school and department number” 
    2. A window will open indicating the sender’s name and department name 
    3. Select CONTINUE 
    4. Your contract will now load 
    5. Click START on the left side to review the contract and begin the signing process 
    6. Click NAME and type your first and last name 
    7. Click SIGN to sign your contract 
    8. Click FINISH You have now signed your contract and you will receive an email with a copy of your signed contract for your records. 

    Our office will also have a copy of the signed contract which we will use to process your contract for payment. If you have any questions, please reach out to our dedicated contract email at: swicontracts@docs.rutgers.edu 

    Best wishes for a successful {term} session. 

    Regards,
    Silvana Silvana Craig, 
    MLER Business Manager
    Office of Summer & Winter Sessions 
    3 Rutgers Plaza 
    New Brunswick, NJ 08901 
    848-932-8159"""


class ContractViewSet(viewsets.ModelViewSet):
    queryset = Contract.objects.all()
    serializer_class = ContractSerializer
    permission_classes = [IsAuthenticated, IsAdmin]

    def get_queryset(self):
        queryset = Contract.objects.all()
        return queryset
    
    def perform_create(self, serializer):
        serializer.save(modified_by=self.request.user)

    def perform_update(self, serializer):
        serializer.save(modified_by=self.request.user)
    
    def get_serializer_context(self):
        return super().get_serializer_context()

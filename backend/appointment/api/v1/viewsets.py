from rest_framework import viewsets
from appointment.models import Appointment, State, AcademicYear, FileWithRutgers, Status, VisaStatus, Instructor
from .serializers import *
from datetime import datetime
from django.db.models import Q
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import status
from general.enum_helper import AppointmentStatus, ContractStatus
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter

class StateViewSet(viewsets.ModelViewSet):
    queryset = State.objects.all().order_by('name')
    serializer_class = StateSerializer

    def perform_create(self, serializer):
        # Set the modified_by field to the currently logged-in user
        serializer.save(modified_by=self.request.user)

    def perform_update(self, serializer):
        # Set the modified_by field to the currently logged-in user
        # Set the modified_at field to the current timestamp
        serializer.save(modified_by=self.request.user, modified_at=datetime.now())
    
    @action(detail=False, methods=['post'], url_path='add-all-states')
    def add_all_states(self, request):
        try:
            states_data = request.data
            states_objects = []

            with transaction.atomic():
                for state in states_data:
                    state_name = state.get('name')
                    if state_name:
                        state_obj, _ = State.objects.get_or_create(name=state_name)
                        states_objects.append(state_obj)
            serializer = StateSerializer(states_objects, many=True)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class AcademicYearViewSet(viewsets.ModelViewSet):
    queryset = AcademicYear.objects.all()
    serializer_class = AcademicYearSerializer

    def perform_create(self, serializer):
        # Set the modified_by field to the currently logged-in user
        serializer.save(modified_by=self.request.user)

    def perform_update(self, serializer):
        # Set the modified_by field to the currently logged-in user
        # Set the modified_at field to the current timestamp
        serializer.save(modified_by=self.request.user, modified_at=datetime.now())


class FileWithRutgersViewSet(viewsets.ModelViewSet):
    queryset = FileWithRutgers.objects.all()
    serializer_class = FileWithRutgersSerializer

    def perform_create(self, serializer):
        # Set the modified_by field to the currently logged-in user
        serializer.save(modified_by=self.request.user)

    def perform_update(self, serializer):
        # Set the modified_by field to the currently logged-in user
        # Set the modified_at field to the current timestamp
        serializer.save(modified_by=self.request.user, modified_at=datetime.now())


class VisaPermitTypeViewSet(viewsets.ModelViewSet):
    queryset = VisaPermitType.objects.all()
    serializer_class = VisaPermitTypeSerializer
    http_method_names = ['get']

    def perform_create(self, serializer):
        # Set the modified_by field to the currently logged-in user
        serializer.save(modified_by=self.request.user)

    def perform_update(self, serializer):
        # Set the modified_by field to the currently logged-in user
        # Set the modified_at field to the current timestamp
        serializer.save(modified_by=self.request.user, modified_at=datetime.now())


class StatusViewSet(viewsets.ModelViewSet):
    queryset = Status.objects.all()
    serializer_class = StatusSerializer

    def perform_create(self, serializer):
        # Set the modified_by field to the currently logged-in user
        serializer.save(modified_by=self.request.user)

    def perform_update(self, serializer):
        # Set the modified_by field to the currently logged-in user
        # Set the modified_at field to the current timestamp
        serializer.save(modified_by=self.request.user, modified_at=datetime.now())


class VisaStatusViewSet(viewsets.ModelViewSet):
    queryset = VisaStatus.objects.all()
    serializer_class = VisaStatusSerializer

    def perform_create(self, serializer):
        # Set the modified_by field to the currently logged-in user
        serializer.save(modified_by=self.request.user)

    def perform_update(self, serializer):
        # Set the modified_by field to the currently logged-in user
        # Set the modified_at field to the current timestamp
        serializer.save(modified_by=self.request.user, modified_at=datetime.now())


class InstructorViewSet(viewsets.ModelViewSet):
    queryset = Instructor.objects.all()
    serializer_class = InstructorSerializer

    def perform_create(self, serializer):
        # Set the modified_by field to the currently logged-in user
        serializer.save(modified_by=self.request.user)

    def perform_update(self, serializer):
        # Set the modified_by field to the currently logged-in user
        # Set the modified_at field to the current timestamp
        serializer.save(modified_by=self.request.user, modified_at=datetime.now())

    def get_queryset(self):
        queryset = super().get_queryset()
        employee_number = self.request.query_params.get('employee_number', None)
        first_name = self.request.query_params.get('first_name', None)
        last_name = self.request.query_params.get('last_name', None)
        if employee_number:
            queryset = queryset.filter(employee_number=employee_number)
        if first_name:
            queryset = queryset.filter(first_name__icontains=first_name)
        if last_name:
            queryset = queryset.filter(last_name__icontains=last_name)
        return queryset.order_by('last_name')

    @action(detail=True, methods=['GET'])
    def past_appointments(self, request, pk=None):
        # Get the Instructor instance using the provided primary key (pk)
        instructor = self.get_object()
        # Get the current year
        current_year = datetime.now().year
        # Filter past appointments based on the year in CourseSection
        past_appointments = Appointment.objects.filter(
            instructor=instructor,
            course_section__year__lt=current_year,
        )
        # Serialize the past appointments data
        serializer = AppointmentSerializer(past_appointments, many=True, context={'request': request})
        return Response(serializer.data)


class AppointeeRoleViewSet(viewsets.ModelViewSet):
    queryset = AppointeeRole.objects.all()
    serializer_class = AppointeeRoleSerializer


class JobClassCodeViewSet(viewsets.ModelViewSet):
    queryset = JobClassCode.objects.all()
    serializer_class = JobClassCodeSerializer


class EmploymentTypeViewSet(viewsets.ModelViewSet):
    queryset = EmploymentType.objects.all()
    serializer_class = EmploymentTypeSerializer


class BackgroundCollateralTypeViewSet(viewsets.ModelViewSet):
    queryset = BackgroundCollateralType.objects.all()
    serializer_class = BackgroundCollateralTypeSerializer


class AppointmentTypeViewSet(viewsets.ModelViewSet):
    queryset = AppointmentType.objects.all()
    serializer_class = AppointmentTypeSerializer


class AcademicYearTitleViewSet(viewsets.ModelViewSet):
    queryset = AcademicYear.objects.all()
    serializer_class = AcademicYearSerializer


class LecturerFellowPayOptionViewSet(viewsets.ModelViewSet):
    queryset = LecturerFellowPayOption.objects.all()
    serializer_class = LecturerFellowPayOptionSerializer


class AppointmentViewSet(viewsets.ModelViewSet):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ('course_section__offering_unit_cd', 'course_section__subj_cd', 'course_section__course_title')
    search_fields = ['instructor__first_name', 'instructor__last_name', 'instructor__middle_name']

    def get_queryset(self):
        appointment_status = self.request.query_params.get('appointment_status', None)
        queryset = super().get_queryset()

        if appointment_status is not None:
            if appointment_status == AppointmentStatus.PENDING.value:
                # Filter for appointment_status=PENDING, None, and empty string
                queryset = queryset.filter(Q(appointment_status=AppointmentStatus.PENDING.value) | Q(appointment_status__isnull=True) | Q(appointment_status=''))
            elif appointment_status == AppointmentStatus.APPROVED.value:
                # Filter by appointment_status
                queryset = queryset.filter(appointment_status=appointment_status)
                app_to_be_excluded = Contract.objects.filter(
                    is_active=True,
                    status__in=[ContractStatus.HCM_ENTER.value, ContractStatus.HCM_READY.value, ContractStatus.SEND_FOR_SIGNATURE.value]
                ).values_list('appointments', flat=True)
                queryset = queryset.exclude(id__in=app_to_be_excluded)
            elif appointment_status == ContractStatus.HCM_ENTER.value:
                app_to_be_included = Contract.objects.filter(
                    status=ContractStatus.HCM_ENTER.value,
                    is_active=True
                ).values_list('appointments', flat=True)
                queryset = queryset.filter(id__in=app_to_be_included)
            elif appointment_status == ContractStatus.HCM_READY.value:
                app_to_be_included = Contract.objects.filter(
                    status=ContractStatus.HCM_READY.value,
                    is_active=True
                ).values_list('appointments', flat=True)
                queryset = queryset.filter(id__in=app_to_be_included)
            elif appointment_status == ContractStatus.SEND_FOR_SIGNATURE.value:
                app_to_be_included = Contract.objects.filter(
                    status=ContractStatus.SEND_FOR_SIGNATURE.value,
                    is_active=True
                ).values_list('appointments', flat=True)
                queryset = queryset.filter(id__in=app_to_be_included)
            else:
                queryset = queryset.filter(appointment_status=appointment_status)
        return queryset.order_by('instructor__last_name', '-created_at')

    def get_serializer_context(self):
        return super().get_serializer_context()

    def perform_create(self, serializer):
        # Set the modified_by field to the currently logged-in user
        serializer.save(modified_by=self.request.user)

    def perform_update(self, serializer):
        # Set the modified_by field to the currently logged-in user
        # Set the modified_at field to the current timestamp
        serializer.save(modified_by=self.request.user, modified_at=datetime.now())

    def partial_update(self, request, *args, **kwargs):
        # Allow partial updates (PATCH) for the instructor_info field
        instance = self.get_object()
        instructor_info_data = request.data.get('instructor_info', None)
        if instructor_info_data is not None:
            instructor_serializer = InstructorSerializer(instance.instructor, data=instructor_info_data, partial=True)
            instructor_serializer.is_valid(raise_exception=True)
            instructor_serializer.save(modified_by=self.request.user)
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
    
    @action(detail=False, methods=['GET'], url_path="appointment-course-title")
    def appointment_course_title(self, request):
        course_titles = Appointment.objects.values('course_section__course_title').distinct()
        serializer = AppointmentCourseTitleSerializer(course_titles, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def _filter_appointments(self, offering_unit_cd, subj_cd, year, term):

        if subj_cd and offering_unit_cd and year and term:
            return Q(
                course_section__offering_unit_cd=offering_unit_cd,
                course_section__subj_cd=subj_cd,
                course_section__year=year,
                course_section__term=term
            )
        elif year and term:
            return Q(
                course_section__year=year,
                course_section__term=term
            )
        else:
            return None

    @action(detail=False, methods=['GET'], url_path="appointment-status-analytics")
    def appointment_status_analytics(self, request, *args, **kwargs):
        offering_unit_cd = request.GET.get('offering_unit_cd')
        year = request.GET.get('year')
        term = request.GET.get('term')
        subj_cd = request.GET.get('subj_cd')
        # Check if required parameters are missing
        if year is None or term is None:
            return Response({'response_message': 'Both year and term are required.'}, status=status.HTTP_400_BAD_REQUEST)
        appointments_filter = self._filter_appointments(offering_unit_cd, subj_cd, year, term)
        base_filter = Q(appointment_status=AppointmentStatus.APPROVED.value)

        appointments_approved_all = Appointment.objects.filter(appointments_filter & base_filter)
        # Exclude appointments based on Contract status
        app_to_be_excluded = Contract.objects.filter(
            is_active=True,
            status__in=[ContractStatus.HCM_ENTER.value, ContractStatus.HCM_READY.value, ContractStatus.SEND_FOR_SIGNATURE.value]
        ).values_list('appointments', flat=True)
        appointments_approved = appointments_approved_all.exclude(id__in=app_to_be_excluded).count()
        # Count pending appointments
        appointments_pending = Appointment.objects.filter(appointments_filter & Q(appointment_status=AppointmentStatus.PENDING.value) | Q(appointment_status__isnull=True) | Q(appointment_status='')).count()
        # Fetch HCM entered appointments
        hcm_entered_appointments = Contract.objects.filter(
            is_active=True,
            status=ContractStatus.HCM_ENTER.value,
        ).values_list('appointments', flat=True)

        # Count completed appointments
        completed_appointments = appointments_approved_all.filter(id__in=hcm_entered_appointments).count()

        # Calculate incomplete appointments
        incomplete_appointments = appointments_approved + appointments_pending

        response_data = {
            'completed_appointments': completed_appointments,
            'incomplete_appointments': incomplete_appointments,
        }
        return Response(response_data, status=status.HTTP_200_OK)

    def _get_last_term(self, term):
        if term == TermType.WINTER.value:
            return TermType.FALL.value
        elif term == TermType.SPRING.value:
            return TermType.WINTER.value
        elif term == TermType.SUMMER.value:
            return TermType.SPRING.value
        elif term == TermType.FALL.value:
            return TermType.SUMMER.value
        else:
            return None
    
    @action(detail=False, methods=['GET'], url_path="appointment-counts-by-term")
    def appointment_counts_by_term(self, request, *args, **kwargs):
        offering_unit_cd = request.GET.get('offering_unit_cd')
        year = request.GET.get('year')
        term = request.GET.get('term')
        subj_cd = request.GET.get('subj_cd')

        # Check if subj_cd and offering_unit_cd are provided in the query params
        appointments_filter = self._filter_appointments(offering_unit_cd, subj_cd, year, term)

        if appointments_filter is None:
            return Response({'error': 'Both year and term are required.'}, status=status.HTTP_400_BAD_REQUEST)
        appointments_this_term = Appointment.objects.filter(appointments_filter)
        last_term = self._get_last_term(int(term))
        if last_term is None:
            return Response({'response_message': 'Invalid term value.'}, status=status.HTTP_400_BAD_REQUEST)
        appointments_last_term_filter = self._filter_appointments(offering_unit_cd, subj_cd, year, str(last_term))
        if appointments_last_term_filter is None:
            return Response({'error': 'Both year and last term are required.'}, status=status.HTTP_400_BAD_REQUEST)
        appointments_last_term = Appointment.objects.filter(appointments_last_term_filter)
        response_data = {
            'appointments_this_term': appointments_this_term.count(),
            'appointments_last_term': appointments_last_term.count(),
        }

        return Response(response_data, status=status.HTTP_200_OK)


class AdminAppointmentCommentViewSet(viewsets.ModelViewSet):
    queryset = AdminAppointmentComment.objects.all()
    serializer_class = AdminAppointmentCommentSerializer

    def perform_create(self, serializer):
        # Set the modified_by field to the currently logged-in user
        serializer.save(user=self.request.user)

    def perform_update(self, serializer):
        # Set the modified_by field to the currently logged-in user
        # Set the modified_at field to the current timestamp
        serializer.save(user=self.request.user, modified_at=datetime.now())


class GAExperienceViewSet(viewsets.ModelViewSet):
    queryset = GAExperience.objects.all()
    serializer_class = GAExperienceSerializer
    http_method_names = ['get']


class RecordNumberViewSet(viewsets.ModelViewSet):
    queryset = RecordNumber.objects.all()
    serializer_class = RecordNumberSerializer
    http_method_names = ['get']


class InstructorCourseSalaryViewSet(viewsets.ModelViewSet):
    queryset = InstructorCourseSalary.objects.all()
    serializer_class = InstructorCourseSalarySerializer
    http_method_names = ['get']


class SalaryPaymentAlternativeViewSet(viewsets.ModelViewSet):
    queryset = SalaryPaymentAlternative.objects.all()
    serializer_class = SalaryPaymentAlternativeSerializer
    http_method_names = ['get']

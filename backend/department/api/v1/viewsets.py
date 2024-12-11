from rest_framework import viewsets, status, generics
from course.models import CourseSection, OfferingUnit
from department.models import ContactRole, Department, Contact, DepartmentUser
from general.enum_helper import UserType
from .serializers import ContactRoleSerializer, DepartmentCourseSectionSerializer, DepartmentSerializer, ContactSerializer, DepartmentUserAddSerializer, DepartmentUserSerializer
from rest_framework.response import Response
from rest_framework.decorators import action
from django.utils import timezone
from django.db.models import OuterRef, Subquery
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter
from general.permissions import IsAdmin, IsAdminForPOST
from course.api.v1.serializers import OfferingUnitSerializer


class DepartmentViewSet(viewsets.ModelViewSet):
    """
    This viewset allows you to perform CRUD operations on Department objects and additional actions like searching.
    Attributes:
        - queryset: The set of Department objects to work with.
        - serializer_class: The serializer class used for data serialization and deserialization.
        - permission_classes: The permissions required to access this viewset.
    Methods:
        - get_queryset(): Get the appropriate queryset based on the user's privileges. Administrators can access all Department objects, while others can only access their own.
        - create(request, *args, **kwargs): Create one or multiple Department objects. Existing departments are skipped if they already exist.
        - perform_update(serializer): Perform an update operation on a department and set the 'modified_by' field with the requesting user.
        - search(request): Search for an offering unit and a department based on 'offering_unit_cd' and 'subj_cd' query parameters.
        - _get_offering_unit(offering_unit_cd): Get an offering unit by its code.
        - _get_department(subj_cd): Get a department by its subject code.
    Example Usage:
        - Create a new Department: POST /api/departments/
        - Update a Department: PUT /departments/{id}/
        - Delete a Department: DELETE /departments/{id}/
        - Search for an Offering Unit and Department: GET /departments/search/?offering_unit_cd=23&subj_cd=43
    """
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    permission_classes = [IsAdminForPOST]
    
    def get_queryset(self):
        """
        Get the appropriate queryset based on the user's privileges.
        Administrators can access all Department objects, while others can only access their own.
        Returns:
            queryset: The filtered queryset based on user privileges.
        """
        user = self.request.user
        is_admin = user.is_superuser or user.user_type == UserType.ADMIN.value
        if is_admin:
            queryset = Department.objects.all()
        else:
            queryset = Department.objects.filter(departmentuser__user=user)
        return queryset

    def create(self, request, *args, **kwargs):
        """
        Create one or multiple Department objects. Skip existing departments.
        Args:
            request (Request): The HTTP request.
            *args, **kwargs: Additional arguments.
        Returns:
            Response: A response indicating the success of the operation.
        """
        if isinstance(request.data, list):
            serializer = DepartmentSerializer(data=request.data, many=True)
        else:
            serializer = DepartmentSerializer(data=request.data)
        if serializer.is_valid():
            departments_to_create = []
            for department_data in serializer.validated_data:
                subj_cd = department_data.get('subj_cd')
                existing_department = Department.objects.filter(subj_cd=subj_cd).first()
                if not existing_department:
                    departments_to_create.append(department_data)
            
            if departments_to_create:
                Department.objects.bulk_create([Department(**data) for data in departments_to_create])
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                return Response({"detail": "No new departments created. Existing departments skipped."}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def perform_create(self, serializer):
        # Set the modified_by field to the currently logged-in user
        serializer.save(modified_by=self.request.user)

    def perform_update(self, serializer):
        """
        Perform an update operation on a department and set the 'modified_by' field with the requesting user.
        Args:
            serializer (Serializer): The serializer used for data updates.
        """
        serializer.save(modified_by=self.request.user)
    
    @action(detail=False, methods=['GET'])
    def search(self, request):
        """
        Search for an offering unit and a department based on 'offering_unit_cd' and 'subj_cd' query parameters.
        Args:
            request (Request): The HTTP request.
        Returns:
            Response: A response containing the offering unit and department data.
        """
        offering_unit_cd = request.query_params.get('offering_unit_cd')
        subj_cd = request.query_params.get('subj_cd')

        if not offering_unit_cd or not subj_cd:
            return Response({"response_message": "Both offering_unit_cd and subj_cd query parameters are required."}, status=status.HTTP_400_BAD_REQUEST)

        offering_unit = self._get_offering_unit(offering_unit_cd)
        department = self._get_department(subj_cd)

        response_data = {
            "offering_unit": OfferingUnitSerializer(offering_unit).data if offering_unit else None,
            "department": DepartmentSerializer(department).data if department else None
        }
        return Response(response_data, status=status.HTTP_200_OK)

    def _get_offering_unit(self, offering_unit_cd):
        """
        Get an offering unit by its code.
        Args:
            offering_unit_cd (str): The offering unit code.
        Returns:
            offering_unit: The offering unit object.
        """
        return OfferingUnit.objects.filter(offering_unit_cd=offering_unit_cd).first()
        
    def _get_department(self, subj_cd):
        """
        Get a department by its subject code.
        Args:
            subj_cd (str): The subject code.
        Returns:
            department: The department object.
        """
        return Department.objects.filter(subj_cd=subj_cd).first()


class ContactViewSet(viewsets.ModelViewSet):
    """
    This viewset allows you to perform CRUD operations on Contact objects.
    Attributes:
        - queryset: The set of Contact objects to work with.
        - serializer_class: The serializer class used for data serialization and deserialization.
    Methods:
        - toggle_active(request, pk): Toggle the 'is_active' status of a contact. Mark the contact as active or inactive, update related fields, and save the changes.
        - perform_update(serializer): Perform an update operation on a contact and set the 'modified_by' field with the requesting user.
    Example Usage:
        - Create a new Contact: POST /contacts/
        - Update a Contact: PUT /contacts/{id}/
        - Delete a Contact: DELETE /contacts/{id}/
        - Toggle the 'is_active' status of a Contact: POST /contacts/{id}/toggle-active/
    """
    queryset = Contact.objects.all()
    serializer_class = ContactSerializer

    @action(detail=True, methods=['POST'])
    def toggle_active(self, request, pk=None):
        """
        Toggle the 'is_active' status of a contact.
        Args:
            request (Request): The HTTP request.
            pk (int): The primary key of the contact to update.
        Returns:
            Response: A response indicating the success of the operation.
        """
        contact = self.get_object()
        contact.is_active = not contact.is_active
        contact.inactive_by = request.user if not contact.is_active else None
        contact.modified_by = request.user if not contact.is_active else None
        contact.date_inactive = timezone.now() if not contact.is_active else None
        contact.save()
        
        return Response(status=status.HTTP_200_OK)
    
    def perform_update(self, serializer):
        """
        Perform an update operation on a contact and set the 'modified_by' field with the requesting user.
        Args:
            serializer (Serializer): The serializer used for data updates.
        """
        serializer.save(modified_by=self.request.user)

    def perform_create(self, serializer):
        # Set the modified_by field to the currently logged-in user
        serializer.save(modified_by=self.request.user)


class DepartmentUserViewSet(viewsets.ModelViewSet):
    """
    This viewset allows you to perform CRUD operations on DepartmentUser objects.
    Parameters:
        - dept__subj_cd (filter): Filter by department subject code.
        - unit__offering_unit_cd (filter): Filter by offering unit code.
        - user__user_type (filter): Filter by user type.
        - user__net_id (search): Search by user's net ID.
        - user__name (search): Search by user's name.
    For POST requests, the user must have administrative privileges to create DepartmentUser objects.
    Attributes:
        - queryset: The set of DepartmentUser objects to work with.
        - serializer_class: The serializer class used for data serialization and deserialization.
        - permission_classes: The permissions required to access this viewset.
        - filter_backends: The filter backends used for filtering and searching.
        - filterset_fields: Fields available for filtering.
        - search_fields: Fields available for searching.
    Methods:
        - perform_update(serializer): Performs the update operation and sets the 'modified_by' field with the requesting user.
        - get_queryset(): Returns the appropriate queryset based on the requesting user's privileges. Administrators can access all DepartmentUser objects, while others can only access their own.
        - get_serializer_class(): Chooses the serializer class based on the HTTP method. For POST and update methods, it uses DepartmentUserAddSerializer; for other methods, it uses DepartmentUserSerializer.
    Example Usage:
        - Create a new DepartmentUser object: POST /department-users/
        - Update a DepartmentUser object: PUT /department-users/{id}/
        - Retrieve a list of DepartmentUser objects: GET /department-users/
    """
    queryset = DepartmentUser.objects.all()
    serializer_class = DepartmentUserSerializer
    permission_classes = [IsAdminForPOST]
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ('dept__subj_cd', 'unit__offering_unit_cd', 'user__user_type')
    search_fields = ['user__net_id', 'user__name']

    def perform_create(self, serializer):
        # Set the modified_by field to the currently logged-in user
        serializer.save(modified_by=self.request.user)

    def perform_update(self, serializer):
        serializer.save(modified_by=self.request.user)

    def get_queryset(self):
        user = self.request.user
        is_admin = user.is_superuser or user.user_type == UserType.ADMIN.value
        if is_admin:
            queryset = DepartmentUser.objects.all()
        else:
            queryset = DepartmentUser.objects.filter(user=user)
        return queryset
    
    def get_serializer_class(self):
        if self.request.method in ['POST', 'PUT', 'PATCH']:
            return DepartmentUserAddSerializer
        return DepartmentUserSerializer


class ContactRoleViewSets(viewsets.ModelViewSet):
    queryset = ContactRole.objects.all()
    serializer_class = ContactRoleSerializer


class DepartmentListView(generics.ListAPIView):
    """
    This view returns a list of distinct department and offering unit pairs, extracted from the Course Section table.
    The Course Section table contains course-related data, and we need to extract unique department and offering unit pairs
    to map which department belongs to which offering unit.
    It's important to note that Oracle doesn't support distinct fields objects, which is why we manually extract the distinct values
    from the serialized data.
    ## Note : [Updated] as on 5th Jan the query has been optimised with Distinct as we have migrated to Postgres, it support distinct on values response time is reduced now.
    Parameters:
        - offering_unit__offering_unit_cd (filter): Filter by offering unit code.
        - department__subj_cd (filter): Filter by department subject code.
        - department__subj_descr (search): Search by department subject description.
    Pagination is enabled, and the results are paginated using PageNumberPagination.
    Returns:
        A JSON response containing unique department and offering unit pairs.
    Example Usage:
        GET /api/departments/?offering_unit__offering_unit_cd=23
        GET /api/departments/?department__subj_cd=43
        GET /api/departments/?department__subj_descr=Law
    """
    serializer_class = DepartmentCourseSectionSerializer
    permission_classes = [IsAdmin]
    queryset = CourseSection.objects.all()
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ('offering_unit__offering_unit_cd', 'department__subj_cd')
    search_fields = ['department__subj_descr']
    
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        queryset = self.filter_queryset(queryset)
        queryset = queryset.distinct('department', 'offering_unit')
        serialized_data = DepartmentCourseSectionSerializer(queryset, many=True).data
        page = self.paginate_queryset(serialized_data)
        if page is not None:
            return self.get_paginated_response(page)
        return Response(serialized_data)

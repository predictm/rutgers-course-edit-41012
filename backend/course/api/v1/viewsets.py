from rest_framework import viewsets, status
from rest_framework.response import Response
from appointment.models import Appointment
from appointment.api.v1.serializers import AppointmentSerializer
from course.api.v1.filtersets import TuitionFilter
from course.models import *
from course.api.v1.serializers import *
from rest_framework.decorators import action
from django.db.models import Q, Sum, IntegerField
from django.db.models.functions import Cast
from django_filters import rest_framework as filters
from rest_framework import filters as rest_filters
from course.tasks import add_sample_data
from general.permissions import IsAdmin
from django.db import transaction
from rest_framework.views import APIView


class OfferingUnitViewSet(viewsets.ModelViewSet):
    """
    A ViewSet for managing offering units.
    This ViewSet provides CRUD (Create, Retrieve, Update, Delete) operations for offering units.
    It supports both single and batch creation of offering units. Existing units with matching
    unique fields will be skipped during batch creation.
    Attributes:
        queryset (QuerySet): A query set containing all offering units.
        serializer_class (Serializer): The serializer class for offering units.
    Methods:
        create(request, *args, **kwargs): Create offering units, handling single and batch creation.
    """
    queryset = OfferingUnit.objects.all()
    serializer_class = OfferingUnitSerializer

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        if isinstance(request.data, list):
            serializer = OfferingUnitSerializer(data=request.data, many=True)
        else:
            serializer = OfferingUnitSerializer(data=request.data)

        if serializer.is_valid():
            units_to_create = []

            for unit_data in serializer.validated_data:
                # Check if an instance with the same unique fields already exists
                instance = OfferingUnit.objects.filter(
                    offering_unit_cd=unit_data['offering_unit_cd'],
                    offering_unit_campus=unit_data['offering_unit_campus'],
                    offering_unit_level=unit_data['offering_unit_level'],
                ).first()

                if not instance:
                    units_to_create.append(unit_data)

            if units_to_create:
                created_units = OfferingUnit.objects.bulk_create([OfferingUnit(**data) for data in units_to_create])
                return Response(
                    {
                        'status': 'success',
                        'response_response_message': f'{len(created_units)} units created successfully',
                        'created_unit_ids': [unit.id for unit in created_units],
                    },
                    status=status.HTTP_201_CREATED,
                )
            else:
                return Response(
                    {"detail": "No new units created. Existing units skipped."},
                    status=status.HTTP_200_OK,
                )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CourseSectionViewSet(viewsets.ModelViewSet):
    queryset = CourseSection.objects.all()
    serializer_class = CourseSectionSerializer
    """
    A ViewSet for managing course sections.
    This ViewSet provides CRUD (Create, Retrieve, Update, Delete) operations for course sections.
    It also includes additional actions for retrieving and updating related data.
    Attributes:
        queryset (QuerySet): A query set containing all course sections.
        serializer_class (Serializer): The serializer class for course sections.
    Methods:
        create(request, *args, **kwargs): Create course sections, handling single and batch creation.
        perform_create(serializer): Set the modified_by field to the currently logged-in user.
        perform_update(serializer): Set the modified_by field to the currently logged-in user.
    Actions:
        - semester(request): Get unique combinations of term and year for course sections.
        - offering_unit(request): Get unique combinations of offering units for course sections.
        - subject(request): Get distinct subjects for course sections.
        - course(request): Get unique courses for course sections.
        - section(request): Get distinct sections for course sections.
        - search_course(request): Search for unique courses based on filters.
        - search_course_section(request): Search for unique course sections based on filters.
        - specific_course_section(request): Get a specific course section by filtering on multiple fields.
        - update_course_section_dates(request, pk): Update course section dates for a specific course section.
        - appointments(request, pk): Get appointments related to a specific course section.
    Example Usage:
        - To create a single course section:
          POST /course-sections/
          Request Body:
          {
              "subj_cd": "COMP101",
              "offering_unit_cd": "ABC123",
              "term": "Fall",
              "year": 2023,
              ...
          }
        - To create multiple course sections in a batch:
          POST /course-sections/
          Request Body (list):
          [
              {
                  "subj_cd": "COMP101",
                  "offering_unit_cd": "ABC123",
                  "term": "Fall",
                  "year": 2023,
                  ...
              },
              {
                  "subj_cd": "MATH201",
                  "offering_unit_cd": "DEF456",
                  "term": "Spring",
                  "year": 2023,
                  ...
              }
          ]

        - To retrieve unique combinations of term and year:
          GET /course-sections/semester/
        - To retrieve unique offering units:
          GET /course-sections/offering-unit/?year=2023&term=Fall
        - To retrieve distinct subjects:
          GET /course-sections/subject/?year=2023&term=Spring
        - To retrieve unique courses:
          GET /course-sections/course/?year=2023&term=Fall&offering_unit_cd=ABC123
        - To retrieve distinct sections:
          GET /course-sections/section/?year=2023&term=Fall&offering_unit_cd=ABC123&subj_cd=COMP101
        - To search for unique courses based on filters:
          GET /course-sections/search-course/?year=2023&term=Spring&offering_unit_cd=DEF456
        - To search for unique course sections based on filters:
          GET /course-sections/search-course-section/?year=2023&term=Fall&subj_cd=COMP101
        - To get a specific course section:
          GET /course-sections/specific-course-section/?year=2023&term=Fall&subj_cd=COMP101...
        - To update course section dates:
          PUT /course-sections/1/update-course-section-dates/
          Request Body:
          {
              "start_date": "2023-09-01",
              "end_date": "2023-12-15",
              ...
          }
        - To get appointments for a specific course section:
          GET /course-sections/1/appointments/
    """


    # @transaction.atomic
    # def create(self, request, *args, **kwargs):
    #     data = request.data
    #     if isinstance(data, list):
    #         serializer = CourseSectionSerializer(data=data, many=True)
    #     else:
    #         serializer = CourseSectionSerializer(data=data)
    #     if serializer.is_valid():
    #         create_course_sections.delay(serializer.validated_data)
    #         return Response(
    #             {'response_message': 'Instances creation task has been scheduled'},
    #             status=status.HTTP_202_ACCEPTED,
    #         )
    #     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    
    # @transaction.atomic
    # def create(self, request, *args, **kwargs):
    #     data = request.data
    #     if isinstance(data, list):
    #         serializer = CourseSectionSerializer(data=data, many=True)
    #     else:
    #         serializer = CourseSectionSerializer(data=data)
    #     if serializer.is_valid():
    #         create_course_sections.delay(serializer.validated_data)
    #         return Response(
    #             {'response_message': 'Instances creation task has been scheduled'},
    #             status=status.HTTP_202_ACCEPTED,
    #         )
    #     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def perform_create(self, serializer):
        # Set the modified_by field to the currently logged-in user
        serializer.save(modified_by=self.request.user, user=self.request.user)

    def perform_update(self, serializer):
        # Set the modified_by field to the currently logged-in user
        serializer.save(modified_by=self.request.user)
    
    @action(detail=False, methods=['GET'])
    def semester(self, request):
        unique_combinations = CourseSection.objects.values('term', 'year').distinct().order_by('-year', 'term')        
        serializer = CourseSectionSemesterSerializer(unique_combinations, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['GET'], url_path="offering-unit")
    def offering_unit(self, request):
        year = request.query_params.get('year')
        term = request.query_params.get('term')
        filter_conditions = Q()
        if year:
            filter_conditions &= Q(year=year)
        if term:
            filter_conditions &= Q(term=term)
        unique_combinations = CourseSection.objects.filter(filter_conditions).values('offering_unit_cd', 'offering_unit').distinct().order_by('offering_unit_cd')
        serializer = CourseSectionOfferingUnitSerializer(unique_combinations, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['GET'], url_path="offering-unit-subject")
    def offering_unit_subject(self, request):
        """
        API to get unique combinations of offering units and subjects associated
        Note : Oracle doesn't support distinct on multiple fields, therefore using the 
        serializer.Serializer instead of model serialization.
        """
        # Group by offering_unit_cd and subj_cd and get unique combinations
        queryset = CourseSection.objects.all()
        unique_combinations = queryset.values('offering_unit_cd', 'subj_cd', 'offering_unit', 'department').distinct().order_by('offering_unit_cd', 'subj_cd')
        # Serialize the data
        serializer = OfferingUnitSubjectSerializer(unique_combinations, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['GET'], url_path="subject")
    def subject(self, request):
        year = request.query_params.get('year')
        term = request.query_params.get('term')
        offering_unit_cd = request.query_params.get('offering_unit_cd')
        filter_conditions = Q()
        if year:
            filter_conditions &= Q(year=year)
        if term:
            filter_conditions &= Q(term=term)
        if offering_unit_cd:
            filter_conditions &= Q(offering_unit_cd=offering_unit_cd)
        filtered_records = CourseSection.objects.filter(filter_conditions).select_related('offering_unit')
        distinct_subjects = filtered_records.values('subj_cd', 'offering_unit__offering_unit_level', 'department').distinct().order_by('subj_cd')
        serializer = CourseSectionSubjCdSerializer(distinct_subjects, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['GET'], url_path="course")
    def course(self, request):
        filter_conditions = Q()
        filter_params = {
            'year': 'year',
            'term': 'term',
            'offering_unit_cd': 'offering_unit_cd',
            'subj_cd': 'subj_cd',
            'offering_unit_level': 'offering_unit__offering_unit_level',
        }
        for param, field_name in filter_params.items():
            param_value = request.query_params.get(param)
            if param_value:
                filter_conditions &= Q(**{field_name: param_value})
        filtered_records = CourseSection.objects.filter(filter_conditions).distinct('course_no').order_by('course_no')
        # for oracle db use below commented code
        # unique_courses = {}
        # for record in filtered_records:
        #     course_no = record.course_no
        #     if course_no not in unique_courses:
        #         unique_courses[course_no] = record
        # unique_records = list(unique_courses.values())
        serializer = CourseSectionListCourseSerializer(filtered_records, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['GET'], url_path="section")
    def section(self, request):
        filter_conditions = Q()
        filter_params = {
            'year': 'year',
            'term': 'term',
            'offering_unit_cd': 'offering_unit_cd',
            'subj_cd': 'subj_cd',
            'offering_unit_level': 'offering_unit__offering_unit_level',
            'course_no': 'course_no',
        }
        for param, field_name in filter_params.items():
            param_value = request.query_params.get(param)
            if param_value:
                filter_conditions &= Q(**{field_name: param_value})
        filtered_records = CourseSection.objects.filter(filter_conditions).order_by('section_no')
        serializer = CourseSectionListSectionSerializer(filtered_records, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['GET'], url_path="search-course")
    def search_course(self, request):
        filter_conditions = Q()
        filter_params = {
            'year': 'year',
            'term': 'term',
            'offering_unit_cd': 'offering_unit_cd',
            'subj_cd': 'subj_cd',
            'offering_unit_level': 'offering_unit__offering_unit_level',
        }
        for param, field_name in filter_params.items():
            param_value = request.query_params.get(param)
            if param_value:
                filter_conditions &= Q(**{field_name: param_value})
        filtered_records = CourseSection.objects.filter(filter_conditions).order_by('course_no').distinct('course_no')
        serializer = CourseSectionSearchCourseSerializer(filtered_records, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['GET'], url_path="search-course-section")
    def search_course_section(self, request):
        filter_conditions = Q()
        filter_params = {
            'year': 'year',
            'term': 'term',
            'offering_unit_cd': 'offering_unit_cd',
            'subj_cd': 'subj_cd',
            'offering_unit_level': 'offering_unit__offering_unit_level',
            'course_no': 'course_no',
            'course_suppl_cd': 'course_suppl_cd',
        }
        for param, field_name in filter_params.items():
            param_value = request.query_params.get(param)
            if param_value:
                filter_conditions &= Q(**{field_name: param_value})
        filtered_records = CourseSection.objects.filter(filter_conditions).order_by('section_no')
        serializer = CourseSectionSearchCourseSectionSerializer(filtered_records, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['GET'], url_path="specific-course-section")
    def specific_course_section(self, request):
        filter_conditions = Q()
        filter_params = {
            'year': 'year',
            'term': 'term',
            'offering_unit_cd': 'offering_unit_cd',
            'subj_cd': 'subj_cd',
            'offering_unit_level': 'offering_unit__offering_unit_level',
            'course_no': 'course_no',
            'section_no': 'section_no',
            'reg_index_no': 'reg_index_no',
            'course_suppl_cd': 'course_suppl_cd',
        }
        for param, field_name in filter_params.items():
            param_value = request.query_params.get(param)
            if param_value:
                filter_conditions &= Q(**{field_name: param_value})
        try:
            filtered_record = CourseSection.objects.filter(filter_conditions)
            if 'course_suppl_cd' not in request.query_params:
                filtered_record = filtered_record.filter(Q(course_suppl_cd__isnull=True) | Q(course_suppl_cd="") | Q(course_suppl_cd=None))
            if not filtered_record.exists():
                raise CourseSection.DoesNotExist
            if filtered_record.count() > 1:
                raise CourseSection.MultipleObjectsReturned
        except CourseSection.DoesNotExist:
            return Response({"response_message": "Instance does not exist"}, status=status.HTTP_400_BAD_REQUEST)
        except CourseSection.MultipleObjectsReturned:
            return Response({"response_message": "Multiple instances found"}, status=status.HTTP_400_BAD_REQUEST)
        serializer = SpecificCourseSectionSerializer(filtered_record.first())
        return Response(serializer.data)
    
    @action(detail=True, methods=['PUT', 'PATCH'], url_path="update-course-section-dates")
    def update_course_section_dates(self, request, pk=None):
        course_section = self.get_object()
        course_section_dates, created = CourseSectionDates.objects.get_or_create(course_section=course_section)
        serializer = CourseSectionDateSerializer(course_section_dates, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.validated_data['modified_by'] = request.user
        serializer.save()
        return Response(serializer.data)
    
    def _filter_course_sections(self, subj_cd, offering_unit_cd, year, term):
        if subj_cd and offering_unit_cd and year and term:
            return Q(
                subj_cd=subj_cd,
                offering_unit__offering_unit_cd=offering_unit_cd,
                year=year,
                term=term
            )
        elif year and term:
            return Q(
                year=year,
                term=term
            )
        else:
            return None
        
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

    @action(detail=False, methods=['GET'], url_path="total-enrollments")
    def total_enrollments(self, request, *args, **kwargs):
        offering_unit_cd = request.GET.get('offering_unit_cd')
        year = request.GET.get('year')
        term = request.GET.get('term')
        subj_cd = request.GET.get('subj_cd')

        course_sections_filter = self._filter_course_sections(subj_cd, offering_unit_cd, year, term)

        if course_sections_filter is None:
            return Response({'error': 'At least year and term are required.'}, status=status.HTTP_400_BAD_REQUEST)
        enrollments_this_term = CourseSection.objects.filter(course_sections_filter).aggregate(total_enrollments=Cast(Sum(Cast('regd_enrollment', IntegerField())), IntegerField()))
        last_term = self._get_last_term(int(term))
        if last_term is None:
            return Response({'error': 'Invalid term value.'}, status=status.HTTP_400_BAD_REQUEST)
        course_sections_last_term_filter = self._filter_course_sections(subj_cd, offering_unit_cd, year, str(last_term))
        if course_sections_last_term_filter is None:
            return Response({'error': 'At least year and last term are required.'}, status=status.HTTP_400_BAD_REQUEST)
        enrollments_last_term = CourseSection.objects.filter(course_sections_last_term_filter).aggregate(total_enrollments=Cast(Sum(Cast('regd_enrollment', IntegerField())), IntegerField()))
        response_data = {
            'enrollments_this_term': enrollments_this_term['total_enrollments'] or 0,
            'enrollments_last_term': enrollments_last_term['total_enrollments'] or 0,
        }
        return Response(response_data, status=status.HTTP_200_OK)

    @action(detail=True, methods=['GET'])
    def appointments(self, request, pk=None):
        # Get the CourseSection instance using the provided primary key (pk)
        course_section = self.get_object()
        # Retrieve all appointments related to the course section
        appointments = Appointment.objects.filter(course_section=course_section)
        # Serialize the appointments data
        serializer = AppointmentSerializer(appointments, many=True)
        return Response(serializer.data)


class OfferingExpTtlViewSet(viewsets.ModelViewSet):
    """
    A ViewSet for managing offering experience titles.
    This ViewSet provides CRUD (Create, Retrieve, Update, Delete) operations for offering experience titles.
    It supports both single and batch creation of offering experience titles, associating them with existing
    course sections and offering units.
    Attributes:
        queryset (QuerySet): A query set containing all offering experience titles.
        serializer_class (Serializer): The serializer class for offering experience titles.
    Methods:
        create(request, *args, **kwargs): Create offering experience titles, handling single and batch creation.
    """
    queryset = OfferingExpTtl.objects.all()
    serializer_class = OfferingExpTtlSerializer

    # @transaction.atomic
    # def create(self, request, *args, **kwargs):
    #     data = request.data
    #     create_offering_exp_ttl.delay(data)

    #     return Response(
    #         {
    #             'status': 'success',
    #             'response_message': 'Task created successfully',
    #         },
    #         status=status.HTTP_202_ACCEPTED,
    #     )


class SctnSubtitleViewSet(viewsets.ModelViewSet):
    """
    A ViewSet for managing section subtitles.
    This ViewSet provides CRUD (Create, Retrieve, Update, Delete) operations for section subtitles.
    It supports both single and batch creation of section subtitles, associating them with existing
    course sections and offering units.
    Attributes:
        queryset (QuerySet): A query set containing all section subtitles.
        serializer_class (Serializer): The serializer class for section subtitles.
    Methods:
        create(request, *args, **kwargs): Create section subtitles, handling single and batch creation.
    """
    queryset = SctnSubtitle.objects.all()
    serializer_class = SctnSubtitleSerializer
    
    
    # @transaction.atomic
    # def create(self, request, *args, **kwargs):
    #     data = request.data
    #     if isinstance(data, list):
    #         serializer = SctnSubtitleSerializer(data=data, many=True)
    #     else:
    #         serializer = SctnSubtitleSerializer(data=data)
    #     if serializer.is_valid():
    #         create_sctn_subtitle_instances.delay(serializer.validated_data)
    #         return Response(
    #             {
    #                 'status': 'success',
    #                 'response_message': 'Task created successfully',
    #             },
    #             status=status.HTTP_202_ACCEPTED,
    #         )
    #     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


    # @transaction.atomic
    # def create(self, request, *args, **kwargs):
    #     data = request.data
    #     if isinstance(data, list):
    #         serializer = SctnSubtitleSerializer(data=data, many=True)
    #     else:
    #         serializer = SctnSubtitleSerializer(data=data)
    #     if serializer.is_valid():
    #         create_sctn_subtitle_instances.delay(serializer.validated_data)
    #         return Response(
    #             {
    #                 'status': 'success',
    #                 'response_message': 'Task created successfully',
    #             },
    #             status=status.HTTP_202_ACCEPTED,
    #         )
    #     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CourseMtgViewSet(viewsets.ModelViewSet):
    """
    A ViewSet for managing course meetings.
    This ViewSet provides CRUD (Create, Retrieve, Update, Delete) operations for course meetings.
    It supports both single and batch creation of course meetings, associating them with existing
    course sections.
    Attributes:
        queryset (QuerySet): A query set containing all course meetings.
        serializer_class (Serializer): The serializer class for course meetings.
    Methods:
        create(request, *args, **kwargs): Create course meetings, handling single and batch creation.
    """
    queryset = CourseMtg.objects.all()
    serializer_class = CourseMtgSerializer

    # @transaction.atomic
    # def create(self, request, *args, **kwargs):
    #     data = request.data
    #     if isinstance(data, list):
    #         serializer = CourseMtgSerializer(data=data, many=True)
    #     else:
    #         serializer = CourseMtgSerializer(data=data)
    #     if serializer.is_valid():
    #         instances = []
    #         for item in serializer.validated_data:
    #             course_section = CourseSection.objects.filter(
    #                 reg_index_no=item['reg_index_no'],
    #                 term=item['term'],
    #                 year=item['year'],
    #             ).first()
    #             if not course_section:
    #                 continue
    #             instance = CourseMtg(course_section=course_section, **item)
    #             instances.append(instance)
    #         CourseMtg.objects.bulk_create(instances)
    #         created_instance_ids = [instance.id for instance in instances]
    #         return Response(
    #             {
    #                 'status': 'success',
    #                 'response_message': f'{len(created_instance_ids)} instances created successfully',
    #                 'created_instance_ids': created_instance_ids,
    #             },
    #             status=status.HTTP_201_CREATED,
    #         )
    #     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CourseStatusTypeViewSet(viewsets.ModelViewSet):
    """
    A ViewSet for managing course status types.
    Attributes:
        queryset (QuerySet): Contains all course status types.
        serializer_class (Serializer): The serializer class for course status types.
    """
    queryset = CourseStatusType.objects.all()
    serializer_class = CourseStatusTypeSerializer


class CourseFeeTypeViewSet(viewsets.ModelViewSet):
    """
    A ViewSet for managing course fee types.
    Attributes:
        queryset (QuerySet): Contains all course fee types.
        serializer_class (Serializer): The serializer class for course fee types.
    """
    queryset = CourseFeeType.objects.all()
    serializer_class = CourseFeeTypeSerializer


class CourseSectionCommentViewSet(viewsets.ModelViewSet):
    """
    A ViewSet for managing course section comments.
    Custom Methods:
        perform_create(self, serializer): Sets the modified_by field to the currently logged-in user when creating a comment.
        perform_update(self, serializer): Sets the modified_by field to the currently logged-in user when updating a comment.
    Attributes:
        queryset (QuerySet): Contains all course section comments.
        serializer_class (Serializer): The serializer class for course section comments.
    """
    queryset = CourseSectionComment.objects.all()
    serializer_class = CourseSectionCommentSerializer
    
    def perform_create(self, serializer):
        # Set the modified_by field to the currently logged-in user
        serializer.save(modified_by=self.request.user, user=self.request.user)

    def perform_update(self, serializer):
        # Set the modified_by field to the currently logged-in user
        serializer.save(modified_by=self.request.user)


class TuitionViewSet(viewsets.ModelViewSet):
    """
    A ViewSet for managing tuition information.
    Custom Methods:
        perform_create(self, serializer): Sets the modified_by field to the currently logged-in user when creating a tuition record.
        perform_update(self, serializer): Sets the modified_by field to the currently logged-in user when updating a tuition record.
    Additional Features:
        - Supports filtering and ordering using the Django Filter Backend and Ordering Filter.
        - Specifies the filter class as TuitionFilter.
        - Defines allowed ordering fields including 'year', 'term', 'tuition_fees', 'offering_unit__offering_unit_cd', and 'offering_unit__offering_unit_descr'.
        - Requires administrative privileges (permission class: IsAdmin) to access these views.
    Attributes:
        queryset (QuerySet): Contains all tuition records.
        serializer_class (Serializer): The serializer class for tuition records.
        filter_backends (tuple): Tuple of filter backends for filtering and ordering.
        filterset_class (FilterSet): The filter class for tuition records.
        ordering_fields (list): List of allowed ordering fields.
        permission_classes (list): List of required permission classes.
    """
    queryset = Tuition.objects.all()
    serializer_class = TuitionSerializer
    filter_backends = (filters.DjangoFilterBackend, rest_filters.OrderingFilter)
    filterset_class = TuitionFilter
    ordering_fields = ['year', 'term', 'tuition_fees', 'offering_unit__offering_unit_cd', 'offering_unit__offering_unit_descr']
    permission_classes = [IsAdmin]

    # @transaction.atomic
    # def create(self, request, *args, **kwargs):
    #     data = request.data
    #     if isinstance(data, list):
    #         serializer = TuitonCreateSerializer(data=data, many=True)
    #     else:
    #         serializer = TuitionSerializer(data=data)
    #     if serializer.is_valid():
    #         created_instances = []
    #         for item in serializer.validated_data:
    #             offering_unit = OfferingUnit.objects.filter(offering_unit_cd=item['offering_unit_cd']).first()
    #             if offering_unit:
    #                 item['offering_unit'] = offering_unit
    #                 item.pop('offering_unit_cd')
    #                 instance = Tuition.objects.filter(offering_unit=offering_unit, year=item['year'], term=item['term']).first()
    #                 if instance:
    #                     instance.tuition_fees = item['tuition_fees']
    #                     instance.save()
    #                 else:
    #                     instance = Tuition.objects.create(offering_unit=offering_unit, year=item['year'], term=item['term'], tuition_fees=item['tuition_fees'])
    #                 created_instances.append(instance)
    #         return Response(
    #             {
    #                 'response_message': f'{len(created_instances)} instances created/updated successfully',
    #                 'created_instance_ids': [instance.id for instance in created_instances],
    #             },
    #             status=status.HTTP_201_CREATED,
    #         )
    #     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def perform_create(self, serializer):
        # Set the modified_by field to the currently logged-in user
        serializer.save(modified_by=self.request.user)

    def perform_update(self, serializer):
        # Set the modified_by field to the currently logged-in user
        serializer.save(modified_by=self.request.user)


class SessionDateViewSet(viewsets.ModelViewSet):
    """
    A ViewSet for managing session dates.
    Custom Methods:
        perform_create(self, serializer): Sets the modified_by field to the currently logged-in user when creating a session date.
        perform_update(self, serializer): Sets the modified_by field to the currently logged-in user when updating a session date.
    Attributes:
        queryset (QuerySet): Contains all session dates.
        serializer_class (Serializer): The serializer class for session dates.
    """
    queryset = SessionDate.objects.all()
    serializer_class = SessionDateSerializer

    # @transaction.atomic
    # def create(self, request, *args, **kwargs):
    #     data = request.data
    #     if isinstance(data, list):
    #         serializer = SessionDateSerializer(data=data, many=True)
    #     else:
    #         serializer = SessionDateSerializer(data=data)
    #     if serializer.is_valid():
    #         created_instances = []
    #         for item in serializer.validated_data:
    #             instance, _ = SessionDate.objects.get_or_create(term=item['term'], year=item['year'], session_id_cd=item['session_id_cd'])
    #             instance.start_date = item['start_date']
    #             instance.end_date = item['end_date']
    #             instance.course_session_desc = item['course_session_desc']
    #             instance.save()
    #             created_instances.append(instance)
    #         return Response(
    #             {
    #                 'response_message': f'{len(created_instances)} instances created successfully',
    #                 'created_instance_ids': [instance.id for instance in created_instances],
    #             },
    #             status=status.HTTP_201_CREATED,
    #         )
    #     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def perform_create(self, serializer):
        # Set the modified_by field to the currently logged-in user
        serializer.save(modified_by=self.request.user)

    def perform_update(self, serializer):
        # Set the modified_by field to the currently logged-in user
        serializer.save(modified_by=self.request.user)


class AddSampleDataViewSet(APIView):
    def post(self, request):
        add_sample_data.delay()

        return Response({'response_message': 'Tasks to add sample data have been triggered'})


class SemesterViewSet(viewsets.ModelViewSet):
    serializer_class = SemesterSerializer
    queryset = Semester.objects.all().order_by('is_current_semester',)
    filter_backends = (filters.DjangoFilterBackend, rest_filters.OrderingFilter)
    filterset_fields = ('year', 'term', 'is_current_semester')
    ordering_fields = ('year', 'term')
    http_method_names = ['get',]
    permission_classes = [IsAdmin]

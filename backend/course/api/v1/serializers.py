from rest_framework import serializers
from appointment.api.v1.serializers import AppointmentSerializer, SessionDateSerializer
from appointment.models import Appointment
from course.models import CourseFeeType, CoursePrereq, CourseSectionComment, CourseSectionDates, CourseStatusType, OfferingUnit, CourseSection, OfferingExpTtl, SctnSubtitle, CourseMtg, Semester, SessionDate, Tuition
from department.models import Department
from general.enum_helper import CMSType, CourseType, MeetingDay, TermType, CampusLocation, CourseMeetingMode, PMCodes
from django.contrib.auth import get_user_model

from home.api.v1.serializers import UserSerializer

User = get_user_model()

class OfferingUnitSerializer(serializers.ModelSerializer):
    class Meta:
        model = OfferingUnit
        fields = '__all__'

    def create(self, validated_data):
        # Check if an instance with the same unique fields already exists
        instance = OfferingUnit.objects.filter(
            offering_unit_cd=validated_data['offering_unit_cd'],
            offering_unit_campus=validated_data['offering_unit_campus'],
            offering_unit_level=validated_data['offering_unit_level'],
        ).first()

        if instance:
            # If an instance with these unique fields already exists, return it
            return instance

        # If no conflicts, create and return a new instance
        return OfferingUnit.objects.create(**validated_data)


class CourseSectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseSection
        fields = '__all__'


class OfferingExpTtlSerializer(serializers.ModelSerializer):
    class Meta:
        model = OfferingExpTtl
        fields = '__all__'


class SctnSubtitleSerializer(serializers.ModelSerializer):
    class Meta:
        model = SctnSubtitle
        fields = '__all__'


class CourseMtgSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseMtg
        fields = '__all__'
        extra_kwargs = {"start_time": {"required": False}, "end_time": {"required": False}}


class CourseSectionSemesterSerializer(serializers.ModelSerializer):
    semester_display = serializers.SerializerMethodField()

    class Meta:
        model = CourseSection
        fields = ('term', 'year', 'semester_display')

    def get_semester_display(self, obj):
        term_value = obj.get('term')
        year = obj.get('year')
        return f"{year} {TermType(term_value).display_name()}"


class CourseSectionOfferingUnitSerializer(serializers.ModelSerializer):
    offering_unit = serializers.IntegerField()

    class Meta:
        model = CourseSection
        fields = ('offering_unit_cd', 'offering_unit')


class CourseSectionSubjCdSerializer(serializers.Serializer):
    subj_cd = serializers.CharField(max_length=3)
    offering_unit_level = serializers.CharField(max_length=1, source='offering_unit__offering_unit_level')
    department = serializers.IntegerField()
    subj_display = serializers.SerializerMethodField()

    class Meta:
        fields = ('subj_cd', 'offering_unit_level', 'subj_display', 'department')
    
    def get_subj_display(self, obj):
        return f"{obj.get('subj_cd')}:{obj.get('offering_unit__offering_unit_level')}"


class CourseSectionSearchCourseSerializer(serializers.ModelSerializer):
    display_course_number = serializers.SerializerMethodField()
    section_per_course = serializers.SerializerMethodField()
    section_with_instructors = serializers.SerializerMethodField()
    subtitle = serializers.SerializerMethodField()

    class Meta:
        model = CourseSection
        fields = ['offering_unit_cd', 'subj_cd', 'course_no', 'display_course_number', 'course_title', 'section_per_course', 'section_with_instructors', 'subtitle']

    def get_display_course_number(self, obj):
        return f"{obj.offering_unit_cd}:{obj.subj_cd}:{obj.course_no}"

    def get_section_per_course(self, obj):
        course_section = CourseSection.objects.filter(course_no=obj.course_no).count()
        return course_section
    
    def get_section_with_instructors(self, obj): 
        # TODO : need to add the number of instructor assigned to each section of the course and the replace the course no with instructor assigned
        appointment_count = Appointment.objects.filter(course_section=obj).count()
        # course_section = CourseSection.objects.filter(course_no=obj.course_no).count()
        return appointment_count

    def get_subtitle(self, obj):
        course_section = SctnSubtitle.objects.filter(course_section=obj).first()
        return course_section.subtitle_descr if course_section else None


class CourseSectionListCourseSerializer(serializers.ModelSerializer):

    class Meta:
        model = CourseSection
        fields = ['course_no', ]


class CourseSectionSearchCourseSectionSerializer(serializers.ModelSerializer):
    subtitle = serializers.SerializerMethodField()
    semester_display = serializers.SerializerMethodField()
    appointment = AppointmentSerializer(many=True, source="appointment_course")

    class Meta:
        model = CourseSection
        fields = ['id', 'section_no', 'subtitle', "appointment_required", 'course_title', 'appointment', 'course_no', 'offering_unit_cd', 'subj_cd', 'reg_index_no', 'credits', 'semester_display', 'course_suppl_cd']

    def get_subtitle(self, obj):
        try:
            subtitle = SctnSubtitle.objects.get(course_section=obj)
        except SctnSubtitle.DoesNotExist:
            return None
        return subtitle.subtitle_descr
    
    def get_semester_display(self, obj):
        term_value = obj.term
        year = obj.year
        return f"{year} {TermType(term_value).display_name()}"


class CourseSectionListSectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseSection
        fields = ['id', 'section_no', 'course_suppl_cd']


class CourseMeetingsSectionSerializer(serializers.ModelSerializer):
    day_of_week = serializers.SerializerMethodField()
    campus_location = serializers.SerializerMethodField()
    meeting_mode_cd = serializers.SerializerMethodField()
    pm_code_day = serializers.SerializerMethodField()

    class Meta:
        model = CourseMtg
        fields = '__all__'

    def get_day_of_week(self, obj):
        # Convert mtg_day to the corresponding day name
        return dict(MeetingDay.choices()).get(obj.mtg_day, obj.mtg_day)
    
    def get_campus_location(self, obj):
        return dict(CampusLocation.choices()).get(obj.campus_location, obj.campus_location)
    
    def get_meeting_mode_cd(self, obj):
        return dict(CourseMeetingMode.choices()).get(obj.meeting_mode_cd, obj.meeting_mode_cd)
    
    def get_pm_code_day(self, obj):
        return dict(PMCodes.choices()).get(obj.pm_code, obj.pm_code)


class CourseSectionDateSerializer(serializers.ModelSerializer):
    modified_by = UserSerializer(read_only=True)
    class Meta:
        model = CourseSectionDates
        fields = '__all__'


class OfferingUnitSubjectSerializer(serializers.Serializer):
    offering_unit_cd = serializers.CharField()
    subj_cd = serializers.CharField()
    offering_unit = serializers.IntegerField()
    department = serializers.IntegerField()
    subj_descr = serializers.SerializerMethodField()
    offering_unit_campus = serializers.SerializerMethodField()
    offering_unit_level = serializers.SerializerMethodField()

    def get_subj_descr(self, obj):
        department_id = obj['department'] 
        try:
            department = Department.objects.get(id=department_id)
            subj_descr = department.subj_descr
        except Department.DoesNotExist:
            subj_descr = None 
        return subj_descr

    def get_offering_unit_campus(self, obj):
        offering_unit_id = obj['offering_unit'] 
        try:
            offering_unit = OfferingUnit.objects.get(id=offering_unit_id)
            offering_unit_campus = offering_unit.offering_unit_campus
        except Department.DoesNotExist:
            offering_unit_campus = None 
        return offering_unit_campus

    def get_offering_unit_level(self, obj):
        offering_unit_id = obj['offering_unit'] 
        try:
            offering_unit = OfferingUnit.objects.get(id=offering_unit_id)
            offering_unit_level = offering_unit.offering_unit_level
        except Department.DoesNotExist:
            offering_unit_level = None 
        return offering_unit_level


class CourseSectionCommentSerializer(serializers.ModelSerializer):
    mention_users = serializers.ListField(child=serializers.CharField(), write_only=True, required=False)
    # username = serializers.CharField(source="user.username", read_only=True)
    username = serializers.SerializerMethodField()

    class Meta:
        model = CourseSectionComment
        fields = '__all__'
        extra_kwargs = {'user': {"required": False}}

    def get_username(self, obj):
        return obj.user.name

    def create(self, validated_data):
        mentions_data = validated_data.pop('mention_users', [])
        instance = super().create(validated_data)
        # Find User instances for the mentioned usernames and add them to the mentions M2M field
        mentioned_users = User.objects.filter(username__in=mentions_data)
        instance.mentions.set(mentioned_users)
        return instance


class SpecificCourseSectionSerializer(serializers.ModelSerializer):
    course_meetings = CourseMeetingsSectionSerializer(read_only=True, source="course_mtg_course_section", many=True)
    course_section_dates = CourseSectionDateSerializer(read_only=True)
    comments = CourseSectionCommentSerializer(read_only=True, many=True, source="comment_course_section")
    prerequisite_course = serializers.SerializerMethodField(read_only=True)
    cross_listings = serializers.SerializerMethodField(read_only=True)
    department_name = serializers.CharField(read_only=True, source="department.subj_descr")
    subtitle = serializers.SerializerMethodField()
    cms_type_cd = serializers.SerializerMethodField()
    course_type_cd = serializers.SerializerMethodField()
    in_state_tuition_fees = serializers.SerializerMethodField()
    offering_unit_level = serializers.CharField(read_only=True, source='offering_unit.offering_unit_level')
    appointment = AppointmentSerializer(many=True, source="appointment_course")
    semester_display = serializers.SerializerMethodField()
    session_date = serializers.SerializerMethodField()

    class Meta:
        model = CourseSection
        fields = '__all__'

    def get_prerequisite_course(self, obj):
        course_prereq = CoursePrereq.objects.filter(course_section=obj).first()
        if not course_prereq:
            return None
        expr, unique_course = course_prereq.get_prerequisite_expression()
        return {"expr": expr, "unique_course": unique_course}

    def get_subtitle(self, obj):
        course_section = SctnSubtitle.objects.filter(course_section=obj).first()
        return course_section.subtitle_descr if course_section else None
    
    def get_cross_listings(self, obj):
        cross_listings = []
        for i in range(1, 5):
            cross_list_str=''
            if getattr(obj, f'cross_list_offering_unit_cd_{i}', ''):
                cross_list_str+=f"{getattr(obj, f'cross_list_offering_unit_cd_{i}', '')}:"
            if getattr(obj, f'cross_list_subj_cd_{i}', ''):
                cross_list_str+=f"{getattr(obj, f'cross_list_subj_cd_{i}', '')}:"
            if getattr(obj, f'cross_list_course_no_{i}', ''):
                cross_list_str+=f"{getattr(obj, f'cross_list_course_no_{i}', '')}:"
            if getattr(obj, f'cross_list_section_no_{i}', ''):
                cross_list_str+=f"{getattr(obj, f'cross_list_section_no_{i}', '')}:"
            if getattr(obj, f'cross_list_course_suppl_cd_{i}', ''): 
                cross_list_str+=f"{getattr(obj, f'cross_list_course_suppl_cd_{i}', '')}"
            if cross_list_str:
                cross_listings.append(cross_list_str)
        return [cross[:-1] if cross.endswith(':') else cross for cross in cross_listings if cross.strip(':')]
    
    def get_cms_type_cd(self, obj):
        return dict(CMSType.choices()).get(obj.cms_type_cd, obj.cms_type_cd)

    def get_course_type_cd(self, obj):
        return dict(CourseType.choices()).get(obj.course_type_cd, obj.course_type_cd)
    
    def get_in_state_tuition_fees(self, obj):
        tuition = Tuition.objects.filter(offering_unit=obj.offering_unit, year=obj.year, term=obj.term).first()
        return tuition.tuition_fees if tuition else None
    
    def get_semester_display(self, obj):
        term_value = obj.term
        year = obj.year
        return f"{year} {TermType(term_value).display_name()}"
    
    def get_session_date(self, obj):
        session_date = SessionDate.objects.filter(session_id_cd=obj.session_id_cd, year=obj.year, term=obj.term).first()
        session_date = SessionDateSerializer(session_date).data if session_date else None
        return session_date


class CourseStatusTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseStatusType
        fields = '__all__'


class CourseFeeTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseFeeType
        fields = '__all__'


class TuitionSerializer(serializers.ModelSerializer):
    offering_unit_name = serializers.CharField(source="offering_unit.offering_unit_descr", read_only=True)
    offering_unit_cd = serializers.CharField(source="offering_unit.offering_unit_cd", read_only=True)
    class Meta:
        model = Tuition
        fields = '__all__'


class TuitonCreateSerializer(serializers.Serializer):
    offering_unit_cd = serializers.CharField()
    year = serializers.CharField()
    term = serializers.CharField()
    tuition_fees = serializers.CharField()


class SessionDateSerializer(serializers.ModelSerializer):
    class Meta:
        model = SessionDate
        fields = '__all__'


class SemesterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Semester
        fields = '__all__'

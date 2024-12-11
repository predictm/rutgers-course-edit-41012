from django.utils import timezone
from django.db import models
from general.models import BaseModel
from django.db import models
from simple_history.models import HistoricalRecords
from general.enum_helper import TermType, StatusCD, CMSType, CourseType, MeetingDay, CourseMeetingMode, CampusLocation, PMCodes
from department.models import Department
from django.contrib.auth import get_user_model

User = get_user_model()

class OfferingUnit(BaseModel):
    offering_unit_cd = models.CharField(max_length=2)
    offering_unit_campus = models.CharField(max_length=2)
    offering_unit_level = models.CharField(max_length=1, null=True, blank=True)
    offering_unit_descr = models.CharField(max_length=40, null=True, blank=True)
    home_campus = models.CharField(max_length=2)
    history = HistoricalRecords()

    @property
    def _history_user(self):
        return self.modified_by

    @_history_user.setter
    def _history_user(self, value):
        self.modified_by = value
    
    class Meta:
        unique_together = ('offering_unit_cd', 'offering_unit_campus', 'offering_unit_level')
    
    def __str__(self):
        return f"{self.offering_unit_cd} - {self.offering_unit_descr}"


class CourseSection(models.Model):
    year = models.PositiveIntegerField()
    offering_unit = models.ForeignKey(OfferingUnit, on_delete=models.SET_NULL, related_name="course_offering_unit", null=True, blank=True)
    department = models.ForeignKey(Department, on_delete=models.SET_NULL, related_name="course_department", null=True, blank=True)
    term = models.IntegerField(choices=TermType.choices())
    session_date = models.ForeignKey('SessionDate', on_delete=models.SET_NULL, related_name="course_sections", null=True, blank=True)
    reg_index_no = models.CharField(max_length=5)
    offering_unit_cd = models.CharField(max_length=2, null=True, blank=True)
    subj_cd = models.CharField(max_length=3, null=True, blank=True)
    course_no = models.CharField(max_length=3, null=True, blank=True)
    course_suppl_cd = models.CharField(max_length=2, null=True, blank=True)
    section_no = models.CharField(max_length=2, null=True, blank=True)
    course_title = models.CharField(max_length=20, null=True, blank=True)
    credits = models.CharField(max_length=3, null=True, blank=True)
    stop_point = models.CharField(max_length=3, null=True, blank=True)
    regd_enrollment = models.CharField(max_length=3, null=True, blank=True)
    prior_enrollment = models.CharField(max_length=3, null=True, blank=True)
    print_comment_cd = models.CharField(max_length=2, null=True, blank=True)
    print_comment_descr = models.CharField(max_length=35, null=True, blank=True)
    print_comment_cd2 = models.CharField(max_length=2, null=True, blank=True)
    print_comment_descr2 = models.CharField(max_length=35, null=True, blank=True)
    print_comment_cd3 = models.CharField(max_length=2, null=True, blank=True)
    print_comment_descr3 = models.CharField(max_length=35, null=True, blank=True)
    print_comment_cd4 = models.CharField(max_length=2, null=True, blank=True)
    print_comment_descr4 = models.CharField(max_length=35, null=True, blank=True)
    status_cd = models.CharField(choices=StatusCD.choices(),max_length=1, null=True, blank=True)
    status_descr = models.CharField(max_length=24, null=True, blank=True)
    session_id_cd = models.CharField(max_length=1, null=True, blank=True)
    section_note_1 = models.CharField(max_length=32, null=True, blank=True)
    section_note_2 = models.CharField(max_length=32, null=True, blank=True)
    section_note_3 = models.CharField(max_length=32, null=True, blank=True)
    section_note_4 = models.CharField(max_length=32, null=True, blank=True)
    cross_list_offering_unit_cd_1 = models.CharField(max_length=2, null=True, blank=True)
    cross_list_subj_cd_1 = models.CharField(max_length=3, null=True, blank=True)
    cross_list_course_no_1 = models.CharField(max_length=3, null=True, blank=True)
    cross_list_section_no_1 = models.CharField(max_length=2, null=True, blank=True)
    cross_list_course_suppl_cd_1 = models.CharField(max_length=2, null=True, blank=True)
    cross_list_offering_unit_cd_2 = models.CharField(max_length=2, null=True, blank=True)
    cross_list_subj_cd_2 = models.CharField(max_length=3, null=True, blank=True)
    cross_list_course_no_2 = models.CharField(max_length=3, null=True, blank=True)
    cross_list_section_no_2 = models.CharField(max_length=2, null=True, blank=True)
    cross_list_course_suppl_cd_2 = models.CharField(max_length=2, null=True, blank=True)
    cross_list_offering_unit_cd_3 = models.CharField(max_length=2, null=True, blank=True)
    cross_list_subj_cd_3 = models.CharField(max_length=3, null=True, blank=True)
    cross_list_course_no_3 = models.CharField(max_length=3, null=True, blank=True)
    cross_list_section_no_3 = models.CharField(max_length=2, null=True, blank=True)
    cross_list_course_suppl_cd_3 = models.CharField(max_length=2, null=True, blank=True)
    cross_list_offering_unit_cd_4 = models.CharField(max_length=2, null=True, blank=True)
    cross_list_subj_cd_4 = models.CharField(max_length=3, null=True, blank=True)
    cross_list_course_no_4 = models.CharField(max_length=3, null=True, blank=True)
    cross_list_section_no_4 = models.CharField(max_length=2, null=True, blank=True)
    cross_list_course_suppl_cd_4 = models.CharField(max_length=2, null=True, blank=True)
    proj_enrollment = models.CharField(max_length=3, null=True, blank=True)
    cms_type_cd = models.CharField(choices=CMSType.choices(), max_length=1, null=True, blank=True)
    course_type_cd = models.CharField(choices=CourseType.choices(), max_length=2, null=True, blank=True)
    appointment_required = models.BooleanField(default=True)
    created_at = models.DateTimeField(default=timezone.now)
    modified_at = models.DateTimeField(auto_now=True)
    modified_by = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    history = HistoricalRecords()

    @property
    def _history_user(self):
        return self.modified_by

    @_history_user.setter
    def _history_user(self, value):
        self.modified_by = value

    class Meta:
        unique_together = (
            'year', 'term', 'reg_index_no', 'offering_unit_cd', 'subj_cd', 'course_no', 'course_suppl_cd', 'section_no'
        )

    def __str__(self):
        return f"{self.offering_unit_cd} - {self.subj_cd} - {self.course_no} - {self.course_title}"


class OfferingExpTtl(BaseModel):
    year = models.CharField(max_length=4)
    course_section = models.ForeignKey(CourseSection, on_delete=models.SET_NULL, null=True, blank=True, related_name='offering_exp_course_section')
    term = models.IntegerField(choices=TermType.choices())
    offering_unit_cd = models.CharField(max_length=2)
    subj_cd = models.CharField(max_length=3)
    course_no = models.CharField(max_length=3, null=True, blank=True)
    supplment_cd = models.CharField(max_length=2, null=True, blank=True)
    expand_course_title_descr = models.CharField(max_length=80, null=True, blank=True)
    course_descr = models.TextField(null=True, blank=True)
    history = HistoricalRecords()

    @property
    def _history_user(self):
        return self.modified_by

    @_history_user.setter
    def _history_user(self, value):
        self.modified_by = value
    
    class Meta:
        unique_together = ('year', 'term', 'offering_unit_cd', 'subj_cd', 'course_no', 'supplment_cd')

    def __str__(self):
        return f"{self.subj_cd} {self.course_no} - {self.expand_course_title_descr}"


class SctnSubtitle(BaseModel):
    year = models.CharField(max_length=4)
    term = models.IntegerField(choices=TermType.choices())
    course_section = models.ForeignKey(CourseSection, null=True, blank=True, on_delete=models.SET_NULL, related_name='section_subtitle_course_section')
    offering_unit_cd = models.CharField(max_length=2)
    subj_cd = models.CharField(max_length=3)
    course_no = models.CharField(max_length=3)
    section_no = models.CharField(max_length=2)
    supplment_cd = models.CharField(max_length=2, null=True, blank=True)
    subtitle_descr = models.CharField(max_length=40, null=True, blank=True)
    subtopic_course_descr = models.TextField(null=True, blank=True)
    history = HistoricalRecords()

    @property
    def _history_user(self):
        return self.modified_by

    @_history_user.setter
    def _history_user(self, value):
        self.modified_by = value
    
    class Meta:
        unique_together = ('year', 'term', 'offering_unit_cd', 'subj_cd', 'course_no', 'section_no', 'supplment_cd')

    def __str__(self):
        return f"{self.offering_unit_cd} - {self.subj_cd} - {self.course_no} - {self.subtitle_descr}"


class CourseMtg(BaseModel):
    year = models.PositiveIntegerField()
    term = models.IntegerField(choices=TermType.choices())
    course_section = models.ForeignKey(CourseSection, null=True, blank=True, on_delete=models.SET_NULL, related_name='course_mtg_course_section')
    reg_index_no = models.CharField(max_length=5, null=True, blank=True)
    mtg_day = models.CharField(choices=MeetingDay.choices(), max_length=1, null=True, blank=True)
    start_time = models.CharField(max_length=4, null=True, blank=True)
    pm_code = models.CharField(choices=PMCodes.choices(), max_length=1, null=True, blank=True)
    end_time = models.CharField(max_length=4, null=True, blank=True)
    bldg_cd = models.CharField(max_length=3, null=True, blank=True)
    room_no = models.CharField(max_length=4, null=True, blank=True)
    meeting_mode_cd = models.CharField(choices=CourseMeetingMode.choices(), max_length=2, null=True, blank=True)
    campus_location = models.CharField(choices=CampusLocation.choices(), max_length=1, null=True, blank=True)
    campus_name = models.CharField(max_length=50, null=True, blank=True)
    campus_abbrev = models.CharField(max_length=3, null=True, blank=True)
    history = HistoricalRecords()

    @property
    def _history_user(self):
        return self.modified_by

    @_history_user.setter
    def _history_user(self, value):
        self.modified_by = value
    
    class Meta:
        unique_together = ('year', 'term', 'reg_index_no', 'mtg_day', 'start_time', 'end_time', 'bldg_cd', 'room_no')

    def __str__(self):
        return f"{self.course_section.subj_cd} {self.course_section.course_no} - {self.campus_name}"


class CourseStatusType(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self) -> str:
        return self.name
    
class CourseFeeType(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self) -> str:
        return self.name


class CourseSectionDates(BaseModel):
    course_section = models.OneToOneField(CourseSection, on_delete=models.CASCADE, related_name="course_section_dates")
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    course_status = models.ForeignKey(CourseStatusType, on_delete=models.SET_NULL, null=True, blank=True)
    is_highschool_course = models.BooleanField(default=False)
    course_fee_type = models.ForeignKey(CourseFeeType, on_delete=models.SET_NULL, null=True, blank=True)
    course_fee = models.FloatField(null=True, blank=True)
    history = HistoricalRecords()

    @property
    def _history_user(self):
        return self.modified_by

    @_history_user.setter
    def _history_user(self, value):
        self.modified_by = value

    def __str__(self) -> str:
        return f"{self.course_section} - {self.course_status}"



class CoursePrereq(BaseModel):
    course_section = models.ForeignKey(CourseSection, on_delete=models.CASCADE, related_name="course_prerequisites")
    year = models.PositiveIntegerField()
    term = models.IntegerField(choices=TermType.choices())
    offering_unit_cd = models.CharField(max_length=2)
    subj_cd = models.CharField(max_length=3)
    course_no = models.CharField(max_length=3)
    
    prereq1_unit = models.CharField(max_length=2, blank=True, null=True)
    prereq1_subj = models.CharField(max_length=3, blank=True, null=True)
    prereq1_course = models.CharField(max_length=3, blank=True, null=True)
    prereq1_boolean = models.CharField(max_length=1, blank=True, null=True)

    prereq2_unit = models.CharField(max_length=2, blank=True, null=True)
    prereq2_subj = models.CharField(max_length=3, blank=True, null=True)
    prereq2_course = models.CharField(max_length=3, blank=True, null=True)
    prereq2_boolean = models.CharField(max_length=1, blank=True, null=True)
    
    prereq3_unit = models.CharField(max_length=2, blank=True, null=True)
    prereq3_subj = models.CharField(max_length=3, blank=True, null=True)
    prereq3_course = models.CharField(max_length=3, blank=True, null=True)
    prereq3_boolean = models.CharField(max_length=1, blank=True, null=True)

    prereq4_unit = models.CharField(max_length=2, blank=True, null=True)
    prereq4_subj = models.CharField(max_length=3, blank=True, null=True)
    prereq4_course = models.CharField(max_length=3, blank=True, null=True)
    prereq4_boolean = models.CharField(max_length=1, blank=True, null=True)

    prereq5_unit = models.CharField(max_length=2, blank=True, null=True)
    prereq5_subj = models.CharField(max_length=3, blank=True, null=True)
    prereq5_course = models.CharField(max_length=3, blank=True, null=True)
    prereq5_boolean = models.CharField(max_length=1, blank=True, null=True)

    prereq6_unit = models.CharField(max_length=2, blank=True, null=True)
    prereq6_subj = models.CharField(max_length=3, blank=True, null=True)
    prereq6_course = models.CharField(max_length=3, blank=True, null=True)
    prereq6_boolean = models.CharField(max_length=1, blank=True, null=True)

    prereq7_unit = models.CharField(max_length=2, blank=True, null=True)
    prereq7_subj = models.CharField(max_length=3, blank=True, null=True)
    prereq7_course = models.CharField(max_length=3, blank=True, null=True)
    prereq7_boolean = models.CharField(max_length=1, blank=True, null=True)

    prereq8_unit = models.CharField(max_length=2, blank=True, null=True)
    prereq8_subj = models.CharField(max_length=3, blank=True, null=True)
    prereq8_course = models.CharField(max_length=3, blank=True, null=True)
    prereq8_boolean = models.CharField(max_length=1, blank=True, null=True)

    prereq9_unit = models.CharField(max_length=2, blank=True, null=True)
    prereq9_subj = models.CharField(max_length=3, blank=True, null=True)
    prereq9_course = models.CharField(max_length=3, blank=True, null=True)
    prereq9_boolean = models.CharField(max_length=1, blank=True, null=True)

    prereq10_unit = models.CharField(max_length=2, blank=True, null=True)
    prereq10_subj = models.CharField(max_length=3, blank=True, null=True)
    prereq10_course = models.CharField(max_length=3, blank=True, null=True)
    prereq10_boolean = models.CharField(max_length=1, blank=True, null=True)

    prereq11_unit = models.CharField(max_length=2, blank=True, null=True)
    prereq11_subj = models.CharField(max_length=3, blank=True, null=True)
    prereq11_course = models.CharField(max_length=3, blank=True, null=True)
    prereq11_boolean = models.CharField(max_length=1, blank=True, null=True)

    prereq12_unit = models.CharField(max_length=2, blank=True, null=True)
    prereq12_subj = models.CharField(max_length=3, blank=True, null=True)
    prereq12_course = models.CharField(max_length=3, blank=True, null=True)
    prereq12_boolean = models.CharField(max_length=1, blank=True, null=True)

    prereq13_unit = models.CharField(max_length=2, blank=True, null=True)
    prereq13_subj = models.CharField(max_length=3, blank=True, null=True)
    prereq13_course = models.CharField(max_length=3, blank=True, null=True)
    prereq13_boolean = models.CharField(max_length=1, blank=True, null=True)

    prereq14_unit = models.CharField(max_length=2, blank=True, null=True)
    prereq14_subj = models.CharField(max_length=3, blank=True, null=True)
    prereq14_course = models.CharField(max_length=3, blank=True, null=True)
    prereq14_boolean = models.CharField(max_length=1, blank=True, null=True)

    prereq15_unit = models.CharField(max_length=2, blank=True, null=True)
    prereq15_subj = models.CharField(max_length=3, blank=True, null=True)
    prereq15_course = models.CharField(max_length=3, blank=True, null=True)
    prereq15_boolean = models.CharField(max_length=1, blank=True, null=True)

    prereq16_unit = models.CharField(max_length=2, blank=True, null=True)
    prereq16_subj = models.CharField(max_length=3, blank=True, null=True)
    prereq16_course = models.CharField(max_length=3, blank=True, null=True)
    prereq16_boolean = models.CharField(max_length=1, blank=True, null=True)

    prereq17_unit = models.CharField(max_length=2, blank=True, null=True)
    prereq17_subj = models.CharField(max_length=3, blank=True, null=True)
    prereq17_course = models.CharField(max_length=3, blank=True, null=True)
    prereq17_boolean = models.CharField(max_length=1, blank=True, null=True)

    prereq18_unit = models.CharField(max_length=2, blank=True, null=True)
    prereq18_subj = models.CharField(max_length=3, blank=True, null=True)
    prereq18_course = models.CharField(max_length=3, blank=True, null=True)
    prereq18_boolean = models.CharField(max_length=1, blank=True, null=True)

    prereq19_unit = models.CharField(max_length=2, blank=True, null=True)
    prereq19_subj = models.CharField(max_length=3, blank=True, null=True)
    prereq19_course = models.CharField(max_length=3, blank=True, null=True)
    prereq19_boolean = models.CharField(max_length=1, blank=True, null=True)

    prereq20_unit = models.CharField(max_length=2, blank=True, null=True)
    prereq20_subj = models.CharField(max_length=3, blank=True, null=True)
    prereq20_course = models.CharField(max_length=3, blank=True, null=True)
    prereq20_boolean = models.CharField(max_length=1, blank=True, null=True)

    prereq21_unit = models.CharField(max_length=2, blank=True, null=True)
    prereq21_subj = models.CharField(max_length=3, blank=True, null=True)
    prereq21_course = models.CharField(max_length=3, blank=True, null=True)
    prereq21_boolean = models.CharField(max_length=1, blank=True, null=True)

    prereq22_unit = models.CharField(max_length=2, blank=True, null=True)
    prereq22_subj = models.CharField(max_length=3, blank=True, null=True)
    prereq22_course = models.CharField(max_length=3, blank=True, null=True)
    prereq22_boolean = models.CharField(max_length=1, blank=True, null=True)

    prereq23_unit = models.CharField(max_length=2, blank=True, null=True)
    prereq23_subj = models.CharField(max_length=3, blank=True, null=True)
    prereq23_course = models.CharField(max_length=3, blank=True, null=True)
    prereq23_boolean = models.CharField(max_length=1, blank=True, null=True)

    prereq24_unit = models.CharField(max_length=2, blank=True, null=True)
    prereq24_subj = models.CharField(max_length=3, blank=True, null=True)
    prereq24_course = models.CharField(max_length=3, blank=True, null=True)
    prereq24_boolean = models.CharField(max_length=1, blank=True, null=True)

    boolean_pattern_cd = models.CharField(max_length=2, null=True, blank=True)
    course_suppl_cd = models.CharField(max_length=2)
    history = HistoricalRecords()

    @property
    def _history_user(self):
        return self.modified_by

    @_history_user.setter
    def _history_user(self, value):
        self.modified_by = value

    def get_prerequisite_expression(self):
        prerequisites = []
        unique_courses = set()

        for i in range(1, 25):
            unit = getattr(self, f'prereq{i}_unit', None)
            subj = getattr(self, f'prereq{i}_subj', None)
            course = getattr(self, f'prereq{i}_course', None)
            boolean = getattr(self, f'prereq{i}_boolean', None)
            if unit and subj and course:
                prerequisite = f'{unit}:{subj}:{course}'
                unique_courses.add(prerequisite)
                if boolean == 'A':
                    prerequisite = f'({prerequisite})'
                prerequisites.append(prerequisite)
        if self.boolean_pattern_cd == '01':
            return ' OR '.join(prerequisites), len(unique_courses)
        elif self.boolean_pattern_cd == '02':
            return ' AND '.join(prerequisites), len(unique_courses)
        elif self.boolean_pattern_cd == '03':
            return '(' + ' AND '.join(prerequisites[:-1]) + f') OR {prerequisites[-1]}', len(unique_courses)
        elif self.boolean_pattern_cd == '04':
            return '(' + ' OR '.join(prerequisites[:-1]) + f') AND {prerequisites[-1]}', len(unique_courses)
        elif self.boolean_pattern_cd == '05':
            return '(' + ' AND '.join(prerequisites) + ') OR', len(unique_courses)
        elif self.boolean_pattern_cd == '06':
            return '(' + ' OR '.join(prerequisites[:-1]) + f') AND {prerequisites[-1]}', len(unique_courses)
        elif self.boolean_pattern_cd == '07':
            return '(' + ' AND '.join(prerequisites[:-1]) + f') OR {prerequisites[-1]}', len(unique_courses)
        elif self.boolean_pattern_cd == '08':
            return 'Any course equal or greater', len(unique_courses)
        elif self.boolean_pattern_cd == '09':
            return 'Any two courses', len(unique_courses)
        elif self.boolean_pattern_cd == '10':
            return 'Any two courses within subject', len(unique_courses)

    def __str__(self):
        return f'{self.year} {self.term} {self.subj_cd} {self.course_no}'


class CourseSectionComment(BaseModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="commenter_user")
    course_section = models.ForeignKey(CourseSection, on_delete=models.CASCADE, related_name="comment_course_section")
    text = models.TextField()
    hide_from_unit = models.BooleanField(default=False)
    mentions = models.ManyToManyField(User, related_name='mention_comments', blank=True)
    history = HistoricalRecords()

    @property
    def _history_user(self):
        return self.modified_by

    @_history_user.setter
    def _history_user(self, value):
        self.modified_by = value

    def __str__(self) -> str:
        return f"{self.user.username}-{self.course_section}.{self.text[:10]}"


class Tuition(BaseModel):
    offering_unit = models.ForeignKey(OfferingUnit, on_delete=models.CASCADE)
    year = models.PositiveIntegerField()
    term = models.IntegerField(choices=TermType.choices())
    tuition_fees = models.DecimalField(max_digits=10, decimal_places=2)
    history = HistoricalRecords()

    @property
    def _history_user(self):
        return self.modified_by

    @_history_user.setter
    def _history_user(self, value):
        self.modified_by = value

    class Meta:
        unique_together = ('offering_unit', 'year', 'term')

    def __str__(self):
        return f"Tuition for {self.offering_unit} - Year: {self.year}"
    

class SessionDate(BaseModel):
    year = models.PositiveIntegerField()
    term = models.IntegerField(choices=TermType.choices())
    course_session_desc = models.CharField(max_length=255)
    session_id_cd = models.CharField(max_length=10, null=True, blank=True)
    start_date = models.DateTimeField(null=True, blank=True)
    end_date = models.DateTimeField(null=True, blank=True)
    history = HistoricalRecords()

    @property
    def _history_user(self):
        return self.modified_by

    @_history_user.setter
    def _history_user(self, value):
        self.modified_by = value

    def __str__(self):
        return f"{self.course_session_desc} - Year: {self.year}"


class Semester(BaseModel):
    term = models.IntegerField(choices=TermType.choices())
    year = models.PositiveIntegerField()
    is_current_semester = models.BooleanField(default=False)

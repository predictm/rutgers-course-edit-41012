from django.utils.functional import classproperty
from django.utils.translation import ugettext_lazy as _

from enum import Enum, unique


class BaseEnum(Enum):
    @classmethod
    def choices(cls):
        choices = list()
        for item in cls:
            choices.append((item.value, _(item.descriptive_name)))
        return tuple(choices)

    # string the name
    def __str__(self):
        return self.name

    # int the value
    def __int__(self):
        return self.value

    @classproperty
    def valid_values(cls):
        choices = list()
        for item in cls:
            choices.append(item.value)
        return tuple(choices)

    @property
    def descriptive_name(self):
        return self.name.replace('_', ' ').title()

    @classproperty
    def choices_dict(cls):
        choices = {}
        for item in cls:
            choices[item.value] = _(item.descriptive_name)
        return choices
    
    def display_name(self):
        return self.name.capitalize()


@unique
class GenderChoices(BaseEnum):
    MALE = "MALE"
    FEMALE  = "FEMALE"
    OTHERS = "OTHERS"


@unique
class UserType(BaseEnum):
    ADMIN = "ADMIN"
    DEPARTMENT = "DEPARTMENT"


class ContactRoles(BaseEnum):
    CHAIR = "CHAIR"
    BUSINESS = "BUSINESS"


@unique
class CampusLocation(BaseEnum):
    COLLEGE_AVENUE = '1'
    BUSCH = '2'
    LIVINGSTON = '3'
    DOUGLASS_COOK = '4'
    DOWNTOWN_NEW_BRUNSWICK = '5'
    CAMDEN = '6'
    NEWARK = '7'
    WESTERN_MONMOUTH = '8'  # (valid 3/98)
    CAMDEN_COUNTY_COLLEGE_BLACKWOOD_CAMPUS = '9'  # (valid 1/99)
    ATLANTIC_CITY_MAYS_LANDING_COURT_HOUSE = 'A'  # (valid 4/06)
    BURLINGTON_COUNTY_COMMUNITY_COLLEGE_MT_LAUREL = 'B'  # (valid 4/14)
    CUMBERLAND_COUNTY_COLLEGE = 'C'  # (valid 2/11)
    MERCER_COUNTY_COLLEGE = 'D'  # (valid 4/13)
    RU_AT_THE_SHORE = 'E'  # (valid 2/15)
    COUNTY_COLLEGE_OF_MORRIS = 'H'  # (valid 4/13)
    JOINT_BASE_MCGUIRE_DIX_LAKEHURST_RU_JBMDL = 'J'  # (valid 7/10)
    BROOKDALE_COUNTY_COMMUNITY_COLLEGE_LINCROFT = 'L'  # (valid 5/18)
    MORRIS_COUNTY_SCHOOL_OF_TECHNOLOGY = 'M'  # (valid 4/09)
    NEW_JERSEY_INSTITUTE_OF_TECHNOLOGY = 'N'  # (valid 11/18)
    ONLINE = 'O'  # (valid 12/20)
    POINT_PLEASANT_BEACH = 'P'  # (valid 10/18)
    CHINA = 'Q'  # (valid 6/20)
    RARITAN_VALLEY_COMMUNITY_COLLEGE = 'R'  # (valid 4/09)
    STUDY_ABROAD = 'S'  # (valid 3/08)
    REMOTE_INSTRUCTION = 'T'  # (valid 12/20)
    RUTGERS_BIOMEDICAL_AND_HEALTH_SCIENCES_NEWARK = 'W'  # (valid 11/18)
    OFF_CAMPUS = 'Z'  # (valid 3/00)


@unique
class CMSType(BaseEnum):
    PEARSON_MANAGED_PROGRAM_ONLINE_COURSE = 'A'
    BLACKBOARD = 'B'
    CANVAS = 'C'
    MOODLE = 'M'
    NON_MANAGED_PEARSON = 'P'
    SAKAI = 'S'


@unique
class CourseType(BaseEnum):
    ONLINE = '01'
    HYBRID = '02'
    REMOTE_INSTRUCTION = '03'
    APROVED_IN_PERSON = '04'
    INDEPENDENT_LEARNING = '05'  # (valid 8/22)
    FACE_TO_FACE = '06'  # (valid 2/21)
    CONVERGED_LEARNING_FACE_TO_FACE = '07'  # (valid 2/21)
    CONVERGED_LEARNING_HYBRID = '08'  # (valid 2/21)
    CONVERGED_LEARNING_ONLINE = '09'  # (valid 2/21)
    NON_INSTRUCTIONAL = '99'  # (valid 9/22)


@unique
class CourseMeetingMode(BaseEnum):
    LECTURE = '02'
    DISCUSSION_RECITATION = '03'
    SEMINAR = '04'
    LABORATORY = '05'
    LANGUAGE_WORKSHOP = '06'
    STUDIO_ART_THEATRE_DANCE = '07'
    INDIVIDUAL_MUSIC_LESSONS = '08'
    GROUP_MUSIC_LESSONS = '09'
    PHYSICAL_EDUCATION_FOR_MAJORS = '10'
    PHYSICAL_EDUCATION_FOR_NON_MAJORS = '11'
    PRACTICE_TEACHING_FOR_ONE_HALF_SEMESTER = '12'
    PRACTICE_TEACHING_FOR_FULL_SEMESTER = '13'
    FIELD_WORK = '14'
    INTERNSHIP = '15'
    CLINIC = '16'
    COLLEGE_AGENCY = '17'
    READINGS = '18'
    INDIVIDUAL_PROJECT = '19'
    GROUP_PROJECT = '20'
    HONORS = '21'
    RESEARCH_FOR_THESIS_DISSERTATION = '23'
    INDIVIDUAL_MUSIC_LESSONS_MGSA = '24'
    PROFESSIONAL_PSYCHOLOGY_PRACTICUM = '25'
    PROFESSIONAL_PSYCHOLOGY_DEMONSTRATION = '26'
    WORKSHOP = '27'  # (valid 8/18)
    FILM = '28'  # (valid 4/19)
    STUDY_ABROAD = '29'  # (valid 5/19)
    ONLINE_INSTRUCTION = '90'  # (valid 9/07)
    HYBRID_SECTION = '91'  # (valid 1/09)
    REMOTE_SYNCHRONOUS = '92'  # (valid 3/20)
    REMOTE_ASYNCHRONOUS = '93'  # (valid 3/20)
    NO_INSTRUCTIONAL_COMPONENT = '99'


@unique
class MeetingDay(BaseEnum):
    FRIDAY = 'F'
    THURSDAY = 'H'
    MONDAY = 'M'
    SATURDAY = 'S'
    TUESDAY = 'T'
    SUNDAY = 'U'
    WEDNESDAY = 'W'


@unique
class PMCodes(BaseEnum):
    BEFORE_NOON = 'A'
    PM_HOURS = 'P'


@unique
class StatusCD(BaseEnum):
    ACTIVE_AND_AVAILABLE = '1'  # "This section of this course is active and available for registration (default)"
    INACTIVE_SYSTEM_NOT_AVAILABLE = '2'  # "This section of this course is inactive and is not available for registration because the course is inactive (system generated)"
    INACTIVE_NOT_AVAILABLE = '3'  # "This section of this course is inactive and is not available for registration."
    NOT_AVAILABLE_FOR_ONLINE_REGISTRATION = '4'  # "This section of this course is active, but not available for online registration at this time."


@unique
class TermType(BaseEnum):
    WINTER = 0
    SPRING = 1
    SUMMER = 7
    FALL = 9


@unique
class AppointmentStatus(BaseEnum):
    APPROVED = 'APPROVED'
    PENDING = 'PENDING'


@unique
class AnnouncementType(BaseEnum):
    ALERT = "ALERT"
    MAINTENANCE = "MAINTENANCE"
    NOTICE = "NOTICE"


@unique
class ContractTemplateType(BaseEnum):
    UNION_CONTRACT = "UNION_CONTRACT"
    NON_UNION_CONTRACT = "NON_UNION_CONTRACT"
    ON_LOAD_CONTRACT = "ON_LOAD_CONTRACT"


@unique
class ContractStatus(BaseEnum):
    DRAFT = "Draft"
    SEND_FOR_SIGNATURE = "Send for signature"
    HCM_READY = "HCM_READY"
    HCM_ENTER = "HCM_ENTER"


@unique
class AppointmentTermChoices(BaseEnum):
    WINTER = 0
    SPRING = 1
    SUMMER = 7
    FALL = 9
    FIRST_TIME = 2

from rest_framework import serializers
from accounting.api.v1.serializers import AccountingSerializer
from accounting.models import Accounting
from appointment.models import *
from contract.models import Contract
from course.models import CourseSectionDates, SctnSubtitle, SessionDate
from general.enum_helper import TermType
from home.api.v1.serializers import UserSerializer
from django.db import transaction

class StateSerializer(serializers.ModelSerializer):
    class Meta:
        model = State
        fields = '__all__'


class AcademicYearSerializer(serializers.ModelSerializer):
    class Meta:
        model = AcademicYear
        fields = '__all__'


class FileWithRutgersSerializer(serializers.ModelSerializer):
    class Meta:
        model = FileWithRutgers
        fields = '__all__'


class StatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Status
        fields = '__all__'


class VisaPermitTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = VisaPermitType
        fields = '__all__'


class VisaStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = VisaStatus
        fields = '__all__'


class InstructorSerializer(serializers.ModelSerializer):
    modified_by = UserSerializer(read_only=True)
    
    class Meta:
        model = Instructor
        fields = '__all__'


class JobClassCodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobClassCode
        fields = '__all__'


class EmploymentTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmploymentType
        fields = '__all__'


class BackgroundCollateralTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = BackgroundCollateralType
        fields = '__all__'


class AppointmentTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = AppointmentType
        fields = '__all__'


class AcademicYearTitleSerializer(serializers.ModelSerializer):
    class Meta:
        model = AcademicYearTitle
        fields = '__all__'


class LecturerFellowPayOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = LecturerFellowPayOption
        fields = '__all__'


class AppointeeRoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = AppointeeRole
        fields = '__all__'


class CourseSectionDatesSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseSectionDates
        fields = '__all__'


class SessionDateSerializer(serializers.ModelSerializer):
    class Meta:
        model = SessionDate
        fields = '__all__'


class PastCourseSectionSerializer(serializers.ModelSerializer):
    semester_display = serializers.SerializerMethodField()
    course_section_dates = CourseSectionDatesSerializer(read_only=True)
    session_date = serializers.SerializerMethodField()
    subj_descr = serializers.CharField(source='department.subj_descr', read_only=True)
    subtitle = serializers.SerializerMethodField()
    offering_unit_descr = serializers.CharField(source='offering_unit.offering_unit_descr', read_only=True)
    
    class Meta:
        model = CourseSection
        fields = ['year', 'term', 'offering_unit_cd', 'subj_cd', 'course_no', 'section_no', 'course_suppl_cd', 'semester_display', 'credits', 'course_title', 'department', 'offering_unit', 'reg_index_no', 'course_section_dates', 'session_date', 'offering_unit_descr', 'subj_descr', 'subtitle']

    def get_semester_display(self, obj):
        term_value = obj.term
        year = obj.year
        return f"{year} {TermType(term_value).display_name()}"
    
    def get_session_date(self, obj):
        session_date = SessionDate.objects.filter(session_id_cd=obj.session_id_cd, year=obj.year, term=obj.term).first()
        session_date = SessionDateSerializer(session_date).data if session_date else None
        return session_date
    
    def get_subtitle(self, obj):
        course_section = SctnSubtitle.objects.filter(course_section=obj).first()
        return course_section.subtitle_descr if course_section else None

class ApprovedSalaryHistorySerializer(serializers.ModelSerializer):
    approved_by = UserSerializer(read_only=True)

    class Meta:
        model = ApprovedSalaryHistory
        fields = '__all__'


class AdminAppointmentCommentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = AdminAppointmentComment
        fields = '__all__'


class AppointmentPastSalarySerializer(serializers.ModelSerializer):
    class Meta:
        model = AppointmentPastSalary
        fields = '__all__'


class GAExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        model = GAExperience
        fields = '__all__'


class RecordNumberSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecordNumber
        fields = '__all__'


class InstructorCourseSalarySerializer(serializers.ModelSerializer):
    class Meta:
        model = InstructorCourseSalary
        fields = '__all__'


class SalaryPaymentAlternativeSerializer(serializers.ModelSerializer):
    class Meta:
        model = SalaryPaymentAlternative
        fields = '__all__'


class AppointmentSerializer(serializers.ModelSerializer):
    instructor_info = InstructorSerializer(read_only=True, source="instructor")
    appointment_status_detail = serializers.SerializerMethodField()
    course_section_details = PastCourseSectionSerializer(read_only=True, source='course_section')
    modified_by = UserSerializer(read_only=True)
    admin_comments = AdminAppointmentCommentSerializer(read_only=True, many=True)
    salary_history = ApprovedSalaryHistorySerializer(read_only=True, many=True)
    past_salaries = AppointmentPastSalarySerializer(many=True, required=False)
    default_sch_acc_code = serializers.SerializerMethodField()
    approved_by_info = UserSerializer(read_only=True, source="approved_by")
    proposed_by_info = UserSerializer(read_only=True, source="proposed_by")
    contract_details = serializers.SerializerMethodField()
    calculated_overwrite_contact_hours = serializers.SerializerMethodField()

    class Meta:
        model = Appointment
        fields = '__all__'

    def validate(self, data):
        course_section = data.get('course_section')
        instructor = data.get('instructor')
        # Check if the instructor is already assigned to the same course section
        existing_assignment = Appointment.objects.filter(
            course_section=course_section,
            instructor=instructor,
        ).exclude(pk=self.instance.pk if self.instance else None)
        if existing_assignment.exists():
            raise serializers.ValidationError({'instructor': 'Instructor is already assigned to this course section.'})
        return data    

    def get_appointment_status_detail(self, obj):
        return dict(AppointmentStatus.choices()).get(obj.appointment_status, obj.appointment_status)
    
    def get_calculated_overwrite_contact_hours(self, obj):
        if obj.overwrite_contact_hours is not None:
            return round(obj.overwrite_contact_hours)
        
        course_section = obj.course_section
        course_credit = int(course_section.credits) / 10 if course_section.credits else 0
        
        session_dates = SessionDate.objects.filter(session_id_cd=course_section.session_id_cd, year=course_section.year, term=course_section.term)
        if session_dates.exists():
            course_start_date = session_dates.first().start_date
            course_end_date = session_dates.first().end_date
            weeks = abs((course_end_date - course_start_date).days) // 7
            if weeks != 0:
                return round((course_credit * 13.75) / weeks)
        return 0


    def get_contract_details(self, obj):
        contract = Contract.objects.filter(instructor=obj.instructor, is_active=True, appointments=obj).first()
        if not contract:
            return None
        return {
            "contract_id": contract.id,
            "contract_status": contract.status,
            "date_send_for_signature": contract.date_send_for_signature,
            "date_signed": contract.date_signed,
            "date_hcm_entered": contract.date_hcm_entered,
            "date_hcm_ready": contract.date_hcm_ready,
            "send_for_signature_by": contract.send_for_signature_by.get_full_name() if contract.send_for_signature_by else None,
            "hcm_entered_by": contract.hcm_entered_by.get_full_name() if contract.hcm_entered_by else None,
            "modified_by": contract.modified_by.get_full_name() if contract.modified_by else None,
            "signed_document": contract.signed_document.url if contract.signed_document else None,
            "previous_contract": contract.previous_contract.id if contract.previous_contract else None
        }

    @transaction.atomic
    def create(self, validated_data):
        past_salaries = validated_data.get('past_salaries', [])
        if past_salaries:
            validated_data.pop('past_salaries')
        appointment = super().create(validated_data)
        if past_salaries:
            past_salary_objects = [
                AppointmentPastSalary(appointment=appointment, modified_by=self.context['request'].user, **past_salary)
                for past_salary in past_salaries
            ]
            AppointmentPastSalary.objects.bulk_create(past_salary_objects)
        return appointment
    
    @transaction.atomic
    def update(self, instance, validated_data):
        past_salaries = validated_data.get('past_salaries', [])
        if past_salaries:
            validated_data.pop('past_salaries')
        is_approved_salary_changed = validated_data.get('approved_salary') != instance.approved_salary
        if instance.approved_salary and is_approved_salary_changed:
            previous_approved_salary = instance.approved_salary
            previous_approved__by = instance.approved_by
            ApprovedSalaryHistory.objects.create(
                appointment=instance,
                approved_salary=instance.approved_salary,
                approved_by=instance.approved_by,
                approval_date=instance.approved_date,
            )
        appointment = super().update(instance, validated_data)
        if past_salaries:
            AppointmentPastSalary.objects.filter(appointment=appointment).delete()
            past_salary_objects = [
                AppointmentPastSalary(appointment=appointment, modified_by=self.context['request'].user, **past_salary)
                for past_salary in past_salaries
            ]
            AppointmentPastSalary.objects.bulk_create(past_salary_objects)
        return appointment

    def get_default_sch_acc_code(self, obj):
        course_section = obj.course_section
        accounting = Accounting.objects.filter(offering_unit=course_section.offering_unit, department=course_section.department).first()
        return AccountingSerializer(accounting).data if accounting else None 


class AppointmentCourseTitleSerializer(serializers.Serializer):
    course_title = serializers.CharField(max_length=255, source="course_section__course_title")

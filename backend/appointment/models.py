from django.db import models
from course.models import CourseSection
from general.enum_helper import AppointmentStatus, AppointmentTermChoices, GenderChoices
from general.models import BaseModel
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from simple_history.models import HistoricalRecords

User = get_user_model()


class State(BaseModel):
    name = models.CharField(max_length=40)

    def __str__(self) -> str:
        return f"{self.name}"


class AcademicYear(BaseModel):
    name = models.CharField(max_length=255)

    def __str__(self) -> str:
        return f"{self.name}"
    
class FileWithRutgers(BaseModel):
    name = models.CharField(max_length=255)

    def __str__(self) -> str:
        return f"{self.name}"


class Status(BaseModel):
    name = models.CharField(max_length=255)

    def __str__(self) -> str:
        return f"{self.name}"


class VisaStatus(BaseModel):
    name = models.CharField(max_length=255)

    def __str__(self) -> str:
        return f"{self.name}"


class VisaPermitType(BaseModel):
    name = models.CharField(max_length=255)

    def __str__(self) -> str:
        return f"{self.name}"   


class Instructor(BaseModel):
    ssn = models.TextField(blank=True, null=True, verbose_name='Social Security Number')
    foreign_national = models.BooleanField(default=False, verbose_name='This instructor is a foreign national, and does not have a Social Security number.')
    employee_number = models.CharField(max_length=20, verbose_name='Employee Number', null=True, blank=True)
    first_name = models.CharField(max_length=100, verbose_name='First Name')
    middle_name = models.CharField(max_length=100, null=True, blank=True, verbose_name='Middle Name')
    last_name = models.CharField(max_length=50, verbose_name='Last Name')
    date_of_birth = models.DateField(verbose_name='Date of Birth')
    gender = models.CharField(max_length=10, choices=GenderChoices.choices(), verbose_name='Gender')
    address1 = models.CharField(max_length=100, verbose_name='Address 1')
    address2 = models.CharField(max_length=100, null=True, blank=True, verbose_name='Address 2')
    city = models.CharField(max_length=50, verbose_name='City')
    state = models.ForeignKey(State, on_delete=models.SET_NULL, null=True, blank=True, verbose_name='State')
    zip_code = models.CharField(max_length=10, verbose_name='Zip')
    primary_email = models.EmailField(verbose_name='Primary Email')
    secondary_email = models.EmailField(null=True, blank=True, verbose_name='Secondary Email')
    primary_phone = models.CharField(max_length=25, verbose_name='Primary Phone #')
    work_phone = models.CharField(max_length=25, null=True, blank=True, verbose_name='Work #')
    cell_phone = models.CharField(max_length=25, null=True, blank=True, verbose_name='Cell #')
    class_during_academic_year = models.ForeignKey(AcademicYear, null=True, blank=True, related_name="instructor_academic_years", on_delete=models.SET_NULL, verbose_name="Title/Class During Academic Year")
    on_file_with_rutgers = models.ForeignKey(FileWithRutgers, null=True, on_delete=models.SET_NULL, blank=True, verbose_name="On File With Rutgers")
    status = models.ForeignKey(Status, on_delete=models.SET_NULL, null=True, blank=True, verbose_name="1-9 Status")
    # visa_type = models.CharField(max_length=255, null=True, blank=True, verbose_name="Visa Type")
    visa_permit_type = models.ForeignKey(VisaPermitType, null=True, blank=True, on_delete=models.SET_NULL, verbose_name="Visa/Permit Type")
    country_of_citizenship = models.CharField(max_length=255, null=True, blank=True, verbose_name="Country of Citizenhip")
    date_of_entry = models.DateField(null=True, blank=True, verbose_name="Date of Entry In USA")
    visa_permit_status = models.ForeignKey(VisaStatus, null=True, blank=True, on_delete=models.SET_NULL, verbose_name="Visa/Permit Status")
    visa_permit_status_date = models.DateField(null=True, blank=True, verbose_name="Visa/Permit Status Date")
    visa_permit_expire_date = models.DateField(null=True, blank=True, verbose_name="Visa/Permit Expire Date")
    history = HistoricalRecords()

    @property
    def _history_user(self):
        return self.modified_by

    @_history_user.setter
    def _history_user(self, value):
        self.modified_by = value

    def __str__(self):
        return f"{self.first_name} {self.last_name} - {self.employee_number}"


class AppointeeRole(BaseModel):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name


class JobClassCode(BaseModel):
    code = models.CharField(max_length=5)
    name = models.CharField(max_length=30)

    def __str__(self):
        return f"{self.code}-{self.name}"


class EmploymentType(BaseModel):
    name = models.CharField(max_length=30)

    def __str__(self):
        return self.name


class BackgroundCollateralType(models.Model):
    name = models.CharField(max_length=30)

    def __str__(self):
        return self.name


class AppointmentType(models.Model):
    name = models.CharField(max_length=30)

    def __str__(self):
        return self.name


class AcademicYearTitle(models.Model):
    title = models.CharField(max_length=100)

    def __str__(self):
        return self.title


class LecturerFellowPayOption(models.Model):
    option = models.CharField(max_length=30)

    def __str__(self):
        return self.option


class GAExperience(models.Model):
    experience = models.CharField(max_length=50)

    def __str__(self):
        return self.experience


class RecordNumber(models.Model):
    number = models.CharField(max_length=15)

    def __str__(self):
        return self.number


class InstructorCourseSalary(models.Model):
    salary_type = models.CharField(max_length=250)

    def __str__(self):
        return self.salary_type


class SalaryPaymentAlternative(models.Model):
    name = models.CharField(max_length=250)

    def __str__(self):
        return self.name


class Appointment(BaseModel):
    course_section = models.ForeignKey(CourseSection, on_delete=models.CASCADE, related_name='appointment_course')
    instructor = models.ForeignKey(Instructor, on_delete=models.CASCADE, related_name='appointment_instructor')
    is_assigned = models.BooleanField(default=False)
    approved_by = models.ForeignKey(User, on_delete=models.SET_NULL, related_name='approved_by_user', null=True, blank=True)
    approved_date = models.DateField(blank=True, null=True)
    proposed_by = models.ForeignKey(User, blank=True, null=True, related_name="proposed_by_user", on_delete=models.SET_NULL)
    proposed_date = models.DateTimeField(null=True, blank=True)
    appointment_status = models.CharField(max_length=30, null=True, blank=True, choices=AppointmentStatus.choices())
    ga_ta_experience = models.ForeignKey(GAExperience, on_delete=models.SET_NULL, null=True)
    primary_instructor = models.BooleanField(default=False)
    role_of_appointee = models.ForeignKey(AppointeeRole, null=True, blank=True, on_delete=models.SET_NULL)
    overwrite_school_acct = models.BooleanField(default=False)
    alt_school_acct = models.CharField(max_length=100, blank=True, null=True)
    overwrite_contact_hours = models.IntegerField(blank=True, null=True)
    special_contract_text = models.CharField(max_length=250, blank=True, null=True)
    appointment_type = models.ForeignKey(AppointmentType, on_delete=models.SET_NULL, null=True, blank=True)
    accepted_low_be_contract = models.BooleanField(default=False)
    date_signed_appointment_letter_returned = models.DateField(null=True, blank=True)
    record_number = models.ForeignKey(RecordNumber, on_delete=models.SET_NULL, null=True, blank=True)
    charging_instructions_processing_date = models.DateField(blank=True, null=True)
    instructor_course_salary = models.ForeignKey(InstructorCourseSalary, on_delete=models.SET_NULL, null=True, blank=True)
    proposed_salary = models.DecimalField(max_digits=22, decimal_places=2, null=True, blank=True)
    approved_salary = models.DecimalField(max_digits=22, decimal_places=2, null=True, blank=True)
    approved = models.BooleanField(default=False)
    background_check_status = models.ForeignKey(BackgroundCollateralType, on_delete=models.SET_NULL, null=True, blank=True)
    background_check_received_date = models.DateField(null=True, blank=True)
    is_revised_appointment_letter = models.BooleanField(default=False)
    employment_type = models.ForeignKey(EmploymentType, on_delete=models.SET_NULL, null=True, blank=True)
    instr_app_job_class_code = models.ForeignKey(JobClassCode, on_delete=models.SET_NULL, null=True, blank=True)
    orig_approved_salary = models.DecimalField(max_digits=22, decimal_places=2, null=True, blank=True)
    past_salary = models.DecimalField(max_digits=22, decimal_places=2, null=True, blank=True)
    salary_payment_alternative = models.ForeignKey(SalaryPaymentAlternative, on_delete=models.SET_NULL, null=True, blank=True)
    history = HistoricalRecords()

    @property
    def _history_user(self):
        return self.modified_by

    @_history_user.setter
    def _history_user(self, value):
        self.modified_by = value

    def clean(self):
        # Check if the instructor is already assigned to the same course section
        existing_assignment = Appointment.objects.filter(course_section=self.course_section, instructor=self.instructor).exclude(id=self.id).exists()
        if existing_assignment:
            raise ValidationError('Instructor is already assigned to this course section.')

    def __str__(self) -> str:
        return f'{self.id} - {self.instructor} - {self.course_section}'


class AdminAppointmentComment(models.Model):
    appointment = models.ForeignKey(Appointment, on_delete=models.CASCADE, related_name='admin_comments')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.appointment} - {self.user} - {self.created_at}'


class ApprovedSalaryHistory(models.Model):
    appointment = models.ForeignKey(Appointment, on_delete=models.CASCADE, related_name='salary_history')
    approved_salary = models.DecimalField(max_digits=22, decimal_places=2)
    approved_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    approval_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.appointment} - {self.approved_salary} - {self.approved_by} - {self.approval_date}'


class AppointmentPastSalary(BaseModel):
    appointment = models.ForeignKey(Appointment, on_delete=models.CASCADE, related_name='past_salaries')
    term = models.IntegerField(choices=AppointmentTermChoices.choices(), verbose_name='Term')
    year = models.CharField(max_length=4, verbose_name='Year')
    salary = models.DecimalField(max_digits=22, decimal_places=2, verbose_name='Salary')

    def __str__(self):
        return f'{self.appointment} - {self.term} {self.year} - ${self.salary}'

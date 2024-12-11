from django.contrib import admin
from .models import (AdminAppointmentComment, AppointmentPastSalary, ApprovedSalaryHistory, GAExperience, InstructorCourseSalary, RecordNumber, SalaryPaymentAlternative, State, AcademicYear, FileWithRutgers, Status, VisaPermitType, VisaStatus, Instructor, AppointeeRole, JobClassCode,
    EmploymentType,
    BackgroundCollateralType,
    AppointmentType,
    AcademicYearTitle,
    LecturerFellowPayOption,
    Appointment,
)
from simple_history.admin import SimpleHistoryAdmin


class StateAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)


class AcademicYearAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)


class FileWithRutgersAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)


class StatusAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)


class VisaStatusAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)


class InstructorAdmin(SimpleHistoryAdmin):
    list_display = ('first_name', 'last_name', 'employee_number', 'gender', 'primary_email', 'date_of_birth')
    list_filter = ('gender', 'status', 'visa_permit_type',)
    search_fields = ('first_name', 'last_name', 'employee_number', 'primary_email')
    date_hierarchy = 'date_of_birth'


@admin.register(VisaPermitType)
class VisaPermitTypeAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)


# Admin class for AppointeeRole
@admin.register(AppointeeRole)
class AppointeeRoleAdmin(admin.ModelAdmin):
    list_display = ['name']


# Admin class for JobClassCode
@admin.register(JobClassCode)
class JobClassCodeAdmin(admin.ModelAdmin):
    list_display = ['code', 'name']


# Admin class for EmploymentType
@admin.register(EmploymentType)
class EmploymentTypeAdmin(admin.ModelAdmin):
    list_display = ['name']


@admin.register(AppointmentPastSalary)
class AppointmentPastSalaryAdmin(admin.ModelAdmin):
    list_display = ['appointment', 'term', 'year', 'salary']


# Admin class for BackgroundCollateralType
@admin.register(BackgroundCollateralType)
class BackgroundCollateralTypeAdmin(admin.ModelAdmin):
    list_display = ['name']


# Admin class for AppointmentType
@admin.register(AppointmentType)
class AppointmentTypeAdmin(admin.ModelAdmin):
    list_display = ['name']


# Admin class for AcademicYearTitle
@admin.register(AcademicYearTitle)
class AcademicYearTitleAdmin(admin.ModelAdmin):
    list_display = ['title']


# Admin class for LecturerFellowPayOption
@admin.register(LecturerFellowPayOption)
class LecturerFellowPayOptionAdmin(admin.ModelAdmin):
    list_display = ['option']


# Admin class for GAExperience
@admin.register(GAExperience)
class GAExperienceAdmin(admin.ModelAdmin):
    list_display = ['experience']


# Admin class for RecordNumber
@admin.register(RecordNumber)
class RecordNumberAdmin(admin.ModelAdmin):
    list_display = ['number']


# Admin class for InstructorCourseSalary
@admin.register(InstructorCourseSalary)
class InstructorCourseSalaryAdmin(admin.ModelAdmin):
    list_display = ['salary_type']


# Admin class for Appointment
@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = ['id', 'instructor', 'course_section', 'approved', 'proposed_salary']
    search_fields = ['instructor__first_name', 'instructor__last_name', 'course_section__course_code']
    list_filter = ['approved', 'primary_instructor']


# Admin class for AdminAppointmentComment
@admin.register(AdminAppointmentComment)
class AdminAppointmentCommentAdmin(admin.ModelAdmin):
    list_display = ['appointment', 'user', 'created_at']
    search_fields = ['appointment__instructor__first_name', 'appointment__instructor__last_name']


# Admin class for ApprovedSalaryHistory
@admin.register(ApprovedSalaryHistory)
class ApprovedSalaryHistoryAdmin(admin.ModelAdmin):
    list_display = ['appointment', 'approved_salary', 'approved_by', 'approval_date']
    search_fields = ['appointment__instructor__first_name', 'appointment__instructor__last_name']


@admin.register(SalaryPaymentAlternative)
class SalaryPaymentAlternativeAdmin(admin.ModelAdmin):
    list_display = ['id', 'name']


admin.site.register(State, StateAdmin)
admin.site.register(AcademicYear, AcademicYearAdmin)
admin.site.register(FileWithRutgers, FileWithRutgersAdmin)
admin.site.register(Status, StatusAdmin)
admin.site.register(VisaStatus, VisaStatusAdmin)
admin.site.register(Instructor, InstructorAdmin)

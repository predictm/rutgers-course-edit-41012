from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .viewsets import *


router = DefaultRouter()
router.register('states', StateViewSet)
router.register('academic-years', AcademicYearViewSet)
router.register('files-with-rutgers', FileWithRutgersViewSet)
router.register('statuses', StatusViewSet)
router.register('visa-statuses', VisaStatusViewSet)
router.register('visa-permit-types', VisaPermitTypeViewSet)
router.register('instructors', InstructorViewSet)
router.register('appointee-roles', AppointeeRoleViewSet)
router.register('job-class-codes', JobClassCodeViewSet)
router.register('employment-types', EmploymentTypeViewSet)
router.register('background-collateral-types', BackgroundCollateralTypeViewSet)
router.register('appointment-types', AppointmentTypeViewSet)
router.register('academic-year-titles', AcademicYearTitleViewSet)
router.register('lecturer-fellow-pay-options', LecturerFellowPayOptionViewSet)
router.register('appointments', AppointmentViewSet)
router.register('admin-appointment-comments', AdminAppointmentCommentViewSet)
router.register('ga-experiences', GAExperienceViewSet, basename='ga-experiences')
router.register('record-numbers', RecordNumberViewSet, basename='record-numbers')
router.register('instructor-course-salaries', InstructorCourseSalaryViewSet, basename='instructor-course-salaries')
router.register('salary-payment-alternatives', SalaryPaymentAlternativeViewSet, basename='salary-payment-alternatives')

urlpatterns = [
    path('', include(router.urls)),
]

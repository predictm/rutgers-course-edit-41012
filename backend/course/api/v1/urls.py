from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .viewsets import AddSampleDataViewSet, CourseFeeTypeViewSet, CourseStatusTypeViewSet, OfferingUnitViewSet, CourseSectionViewSet, OfferingExpTtlViewSet, SctnSubtitleViewSet, CourseMtgViewSet, CourseSectionCommentViewSet, SemesterViewSet, TuitionViewSet, SessionDateViewSet


router = DefaultRouter()
router.register('offering-units', OfferingUnitViewSet)
router.register('course-section', CourseSectionViewSet)
router.register('offering-exp-ttl', OfferingExpTtlViewSet)
router.register('section-subtitle', SctnSubtitleViewSet)
router.register('course-mtg', CourseMtgViewSet)
router.register('course-status-types', CourseStatusTypeViewSet)
router.register('course-fee-types', CourseFeeTypeViewSet)
router.register('course-section-comment', CourseSectionCommentViewSet)
router.register('tuition', TuitionViewSet)
router.register('session-date', SessionDateViewSet)
router.register('active-semester', SemesterViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('add-sample-data/', AddSampleDataViewSet.as_view()),
]

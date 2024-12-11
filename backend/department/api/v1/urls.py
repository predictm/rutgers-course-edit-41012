from django.urls import path, include
from rest_framework.routers import DefaultRouter

from department.api.v1.viewsets import *

router = DefaultRouter()

router.register('department', DepartmentViewSet)
router.register('contact', ContactViewSet)
router.register('contact-roles', ContactRoleViewSets)
router.register('departmentuser', DepartmentUserViewSet)

urlpatterns = [
    path("", include(router.urls)),
    path("all-departments/", DepartmentListView.as_view(), name="all-departments"),
]

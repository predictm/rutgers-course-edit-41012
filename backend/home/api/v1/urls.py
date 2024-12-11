from django.urls import path, include
from rest_framework.routers import DefaultRouter

from home.api.v1.viewsets import (
    AvailableTokenViewSet,
    CreateSuperUserViewSet,
    DashboardAnalytics,
    SignupViewSet,
    LoginViewSet,
    UserViewSet,
    EmailTemplateViewSet,
    AnnouncementViewSet,
    CustomLoginView,
    UserDataAPIView,
    TestingMailViewSet,
)
from django_cas_ng.views import LoginView, LogoutView

router = DefaultRouter()
router.register("signup", SignupViewSet, basename="signup")
router.register("login", LoginViewSet, basename="login")
router.register('users', UserViewSet) 
router.register('available-token', AvailableTokenViewSet) 
router.register('email-template', EmailTemplateViewSet) 
router.register('announcement', AnnouncementViewSet) 

urlpatterns = [
    path("", include(router.urls)),
    path('dashboard-analytics/', DashboardAnalytics.as_view(), name='dashboard-analytics'),
    path('create_superuser/', CreateSuperUserViewSet.as_view({'post': 'create'}), name='create_superuser'),
    path('account/cas/login/', CustomLoginView.as_view(), name='cas_ng_login'),
    path('testing-mail/', TestingMailViewSet.as_view({'get': 'get'}), name='testing_mail'),
    path('account/cas/logout/', LogoutView.as_view(), name='cas_ng_logout'),
    path('user-data/', UserDataAPIView.as_view(), name='user-data'),
]

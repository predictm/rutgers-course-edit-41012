from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AnnouncementViewSet, AnnouncementNotificationViewSet
# Patterns

router = DefaultRouter()
router.register('announcement', AnnouncementViewSet, basename="announcement") 
router.register('announcement/notification', AnnouncementNotificationViewSet, basename="announcement_notification") 

urlpatterns = [
    path("", include(router.urls)),
]

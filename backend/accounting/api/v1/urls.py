from django.urls import path, include
from rest_framework.routers import DefaultRouter
from accounting.api.v1.viewsets import AccountingViewSet

router = DefaultRouter()
router.register('accounting', AccountingViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
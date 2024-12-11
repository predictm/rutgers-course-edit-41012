from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .viewsets import ContractTemplateViewSet, InstructorContractView, DocuSignWebhookViewSet, ContractViewSet


router = DefaultRouter()
router.register(r'contract-templates', ContractTemplateViewSet)
router.register(r'docusign', DocuSignWebhookViewSet, basename='docusign')
router.register(r'contracts', ContractViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('instructor/<int:id>/', InstructorContractView.as_view())
]

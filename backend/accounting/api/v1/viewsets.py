from rest_framework import viewsets
from accounting.api.v1.filtersets import AccountingFilter
from accounting.api.v1.serializers import AccountingSerializer
from django_filters.rest_framework import DjangoFilterBackend
from accounting.models import Accounting
from general.permissions import IsAdmin


class AccountingViewSet(viewsets.ModelViewSet):
    """
    A ViewSet for managing accounting information.
    Custom Methods:
        perform_create(self, serializer): Sets the modified_by field to the currently logged-in user when creating an accounting record.
        perform_update(self, serializer): Sets the modified_by field to the currently logged-in user when updating an accounting record.
    Additional Features:
        - Supports filtering using the Django Filter Backend and AccountingFilter.
        - Requires administrative privileges (permission class: IsAdmin) to access these views.
    Attributes:
        queryset (QuerySet): Contains all accounting records.
        serializer_class (Serializer): The serializer class for accounting records.
        filter_backends (tuple): Tuple of filter backends for filtering.
        filterset_class (FilterSet): The filter class for accounting records.
        permission_classes (list): List of required permission classes.
    """
    queryset = Accounting.objects.all()
    serializer_class = AccountingSerializer
    filter_backends = [DjangoFilterBackend,]
    filterset_class = AccountingFilter
    permission_classes = [IsAdmin]

    def perform_create(self, serializer):
        # Set the modified_by field to the currently logged-in user
        serializer.save(modified_by=self.request.user)

    def perform_update(self, serializer):
        # Set the modified_by field to the currently logged-in user
        serializer.save(modified_by=self.request.user)
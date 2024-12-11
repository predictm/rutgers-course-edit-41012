from .serializers import AnnouncementSerializer, AnnouncementNotificationSerializer
from rest_framework import viewsets, status
from rest_framework.response import Response
from ...models import Announcement, AnnouncementNotification
from rest_framework import filters
# Code


class AnnouncementViewSet(viewsets.ModelViewSet):
    """
    API endpoint for the Announcement model.

    This viewset provides a set of CRUD operations (Create, Retrieve, Update, Delete) for the Announcement model.
    It also includes search and ordering capabilities for the model fields.

    Attributes:
        queryset: The set of Announcement model instances to be used in the viewset.
        serializer_class: The serializer class to use for serializing and deserializing Announcement instances.
        filter_backends: The filter backends to enable filtering and searching capabilities.
        search_fields: The fields on which searching can be performed.
        ordering_fields: The fields on which ordering can be applied.
        authentication_classes: The authentication classes required for accessing this viewset.
        permission_classes: The permissions required for accessing this viewset.
    """
    queryset = Announcement.objects.all()
    serializer_class = AnnouncementSerializer
    filter_backends = [filters.SearchFilter,]
    search_fields = ['title', 'type', 'start_date', 'end_date']


class AnnouncementNotificationViewSet(viewsets.ModelViewSet):
    serializer_class = AnnouncementNotificationSerializer
    queryset = AnnouncementNotification.objects.all()
    http_method_names = ["get"]
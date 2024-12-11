from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from general.permissions import IsOwnerOrReadOnly
from notification.models import Notification
from .serializers import NotificationSerializer
from rest_framework.permissions import IsAuthenticated


class NotificationViewSet(viewsets.ModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]

    def get_queryset(self):
        user = self.request.user
        return Notification.objects.filter(user=user).order_by('-created_at')

    @action(detail=True, methods=['post'], url_path='mark-as-read')
    def mark_as_read(self, request, pk=None):
        notification = self.get_object()
        notification.is_read = True
        notification.save()
        return Response({'response_message': "Notification Marked as Read"},status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'], url_path='unread-notifications')
    def unread_notifications(self, request):
        queryset = self.get_queryset()
        unread_notifications = queryset.filter(is_read=False)
        serializer = self.get_serializer(unread_notifications, many=True)
        page = self.paginate_queryset(unread_notifications)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['get'], url_path='read-notifications')
    def read_notifications(self, request):
        queryset = self.get_queryset()
        read_notifications = queryset.filter(is_read=True)
        serializer = self.get_serializer(read_notifications, many=True)
        page = self.paginate_queryset(read_notifications)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        return Response(serializer.data, status=status.HTTP_200_OK)

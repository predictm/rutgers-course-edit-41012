from django.db import models
from .enums import AnnouncementType
from django.contrib.auth import get_user_model
# Create your models here.
# Import db models

User = get_user_model()

class Announcement(models.Model):
    title = models.CharField(max_length=255)
    type = models.CharField(max_length=30, choices=AnnouncementType.choices())
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    message = models.TextField(null=True, blank=True)
    is_active = models.BooleanField(default=False)


    def __str__(self) -> str:
        return f'{self.type} - {self.title}'
    

class AnnouncementNotification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='announcementNotifications')
    title = models.CharField(max_length=255)
    notification_type = models.CharField(max_length=255)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)

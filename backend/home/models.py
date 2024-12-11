from django.conf import settings
from django.db import models
from general.enum_helper import AnnouncementType
from simple_history.models import HistoricalRecords
from general.models import BaseModel
from django.contrib.contenttypes.models import ContentType


class AvailableToken(BaseModel):
    token = models.CharField(max_length=255)
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    field_name = models.CharField(max_length=255)
    history = HistoricalRecords()

    @property
    def _history_user(self):
        return self.modified_by

    @_history_user.setter
    def _history_user(self, value):
        self.modified_by = value


class EmailTemplate(BaseModel):
    email_type = models.CharField(max_length=255, blank=True, null=True)
    subject = models.CharField(max_length=255)
    message = models.TextField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    to = models.CharField(max_length=255)
    history = HistoricalRecords()

    @property
    def _history_user(self):
        return self.modified_by

    @_history_user.setter
    def _history_user(self, value):
        self.modified_by = value


class Announcement(BaseModel):
    title = models.CharField(max_length=255)
    type = models.CharField(max_length=30, choices=AnnouncementType.choices())
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    message = models.TextField(null=True, blank=True)
    is_active = models.BooleanField(default=False)
    history = HistoricalRecords()

    @property
    def _history_user(self):
        return self.modified_by

    @_history_user.setter
    def _history_user(self, value):
        self.modified_by = value

    def __str__(self) -> str:
        return f'{self.type} - {self.title}'

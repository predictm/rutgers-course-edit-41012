from django.contrib import admin
from .models import Announcement, AnnouncementNotification
# Register your models here.
admin.site.register(Announcement)
admin.site.register(AnnouncementNotification)
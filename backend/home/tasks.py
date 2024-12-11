# tasks.py
from celery import shared_task
from django.utils import timezone
from django.db import transaction
from course.api.v1.serializers import OfferingExpTtlSerializer
from course.models import CourseSection, OfferingExpTtl, OfferingUnit, SctnSubtitle, SessionDate
from department.models import Department
from .models import Announcement
from django.contrib.auth import get_user_model
from notification.models import Notification

User = get_user_model()


@shared_task
def check_announcements():
    try:
        now = timezone.now()
        # Activate announcements that are starting
        announcements_to_activate = Announcement.objects.filter(start_date__lte=now, end_date__gte=now, is_active=False)
        for announcement in announcements_to_activate:
            # Notify all users
            users = User.objects.all()
            for user in users:
                Notification.objects.create(user=user, message=announcement.message, notification_type=announcement.type, title=announcement.title)
            announcement.is_active = True
            announcement.save()
        # Deactivate announcements that have ended
        announcements_to_deactivate = Announcement.objects.filter(end_date__lt=now, is_active=True)
        for announcement in announcements_to_deactivate:
            announcement.is_active = False
            announcement.save()
        return True
    except Exception as e:
        return f"Error in check_announcements task: {e}"



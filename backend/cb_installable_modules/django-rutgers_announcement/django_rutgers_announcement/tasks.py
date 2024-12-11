# from summer_rice_37073 import celery_app
# Remove Above Line and import celery app from current project
# from celery.schedules import crontab

# from django.utils import timezone
# from .models import Announcement, AnnouncementNotification
# from django.contrib.auth import get_user_model
# # Code Block

# User = get_user_model()

# # Cron Service Connector Function

# @celery_app.on_after_configure.connect
# def setup_periodic_tasks(sender, **kwargs):
#     # Calls test('hello') every 10 seconds.
#     sender.add_periodic_task(crontab(minute="*/30"), send_announcements)


# @celery_app.task
# def send_announcements():
#     """_summary_
#         Periodic task to send notification to active announcements
#     Returns:
#         _type_: _description_
#     """
#     try:
#         current_time = timezone.now()
#         # Activate announcements that are starting
#         active_announcements = Announcement.objects.filter(start_date__lte=current_time, end_date__gte=current_time, is_active=False)
#         for announcement in active_announcements:
#             # Notify all users
#             announcement_notifcations = [AnnouncementNotification(user=user, message=announcement.message, notification_type=announcement.type, title=announcement.title) for user in User.objects.all()]
#             AnnouncementNotification.objects.bulk_create(announcement_notifcations)
#         active_announcements.update(is_active=True)
#         # Deactivate announcements that have ended
#         Announcement.objects.filter(end_date__lt=current_time, is_active=True).update(is_active=False)
#         return True
#     except Exception as e:
#         return f"Error in check_announcements task: {e}"
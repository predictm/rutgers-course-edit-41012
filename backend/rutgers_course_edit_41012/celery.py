import os

from celery import Celery
from celery.schedules import crontab

# Set the default Django settings module for the 'celery' program.
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'rutgers_course_edit_41012.settings')

app = Celery('rutgers_course_edit_41012')

# Using a string here means the worker doesn't have to serialize
# the configuration object to child processes.
# - namespace='CELERY' means all celery-related configuration keys
#   should have a `CELERY_` prefix.
app.config_from_object('django.conf:settings', namespace='CELERY')

# Load task modules from all registered Django apps.
app.autodiscover_tasks()
# app.conf.beat_schedule = {
#     "sample_task": {
#         "task": "daily.tasks.export_as_csv",
#         "schedule": crontab(minute="*/3"), # crontab(hour='0,12',minute='0')
#     },
# }

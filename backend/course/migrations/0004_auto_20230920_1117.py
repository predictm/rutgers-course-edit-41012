# Generated by Django 2.2.28 on 2023-09-20 11:17

from django.conf import settings
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('course', '0003_coursefeetype_coursestatustype_cousesectiondates'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='CouseSectionDates',
            new_name='CourseSectionDates',
        ),
    ]
# Generated by Django 2.2.28 on 2023-09-20 10:50

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('course', '0003_coursefeetype_coursestatustype_cousesectiondates'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('appointment', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Appointment',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('modified_at', models.DateTimeField(auto_now=True)),
                ('course_section', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='appointment_course', to='course.CourseSection')),
                ('instructor', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='appointment_instructor', to='appointment.Instructor')),
                ('modified_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
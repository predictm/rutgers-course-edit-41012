# Generated by Django 2.2.28 on 2023-09-25 09:51

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('appointment', '0002_appointment'),
    ]

    operations = [
        migrations.CreateModel(
            name='AcademicYearTitle',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name='AppointmentType',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=30)),
            ],
        ),
        migrations.CreateModel(
            name='BackgroundCollateralType',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=30)),
            ],
        ),
        migrations.CreateModel(
            name='LecturerFellowPayOption',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('option', models.CharField(max_length=30)),
            ],
        ),
        migrations.AddField(
            model_name='appointment',
            name='appointment_status',
            field=models.CharField(blank=True, choices=[('APPROVED', 'Approved'), ('HCM_READY', 'Hcm Ready'), ('PENDING', 'Pending'), ('HCM_ENTER', 'Hcm Enter')], max_length=30, null=True),
        ),
        migrations.AddField(
            model_name='appointment',
            name='approved',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='appointment',
            name='approved_by',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='approved_by_user', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='appointment',
            name='approved_date',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='appointment',
            name='background_collateral_date',
            field=models.DateField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='appointment',
            name='date_revised_sent_for_signature',
            field=models.DateField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='appointment',
            name='date_sent_for_signature',
            field=models.DateField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='appointment',
            name='date_signed_appointment_letter_returned',
            field=models.DateField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='appointment',
            name='date_signed_revised_appointment_letter_returned',
            field=models.DateField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='appointment',
            name='date_submitted_hcm',
            field=models.DateField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='appointment',
            name='dept_comments',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='appointment',
            name='eci_processing_date',
            field=models.DateField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='appointment',
            name='faculty_designation',
            field=models.CharField(blank=True, max_length=20, null=True),
        ),
        migrations.AddField(
            model_name='appointment',
            name='instr_approved_course_salary',
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=22, null=True),
        ),
        migrations.AddField(
            model_name='appointment',
            name='instr_comment',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='appointment',
            name='instr_course_salary',
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=22, null=True),
        ),
        migrations.AddField(
            model_name='appointment',
            name='instr_role_others',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='appointment',
            name='instruct_task',
            field=models.CharField(blank=True, max_length=25, null=True),
        ),
        migrations.AddField(
            model_name='appointment',
            name='instruct_task_other',
            field=models.CharField(blank=True, max_length=250, null=True),
        ),
        migrations.AddField(
            model_name='appointment',
            name='is_assigned',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='appointment',
            name='is_revised_appointment_letter',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='appointment',
            name='lecturer_fellow_salary',
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=22, null=True),
        ),
        migrations.AddField(
            model_name='appointment',
            name='low_enroll',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='appointment',
            name='num_pays',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='appointment',
            name='orig_approved_salary',
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=22, null=True),
        ),
        migrations.AddField(
            model_name='appointment',
            name='past_salary',
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=22, null=True),
        ),
        migrations.AddField(
            model_name='appointment',
            name='primary_instructor',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='appointment',
            name='proposed_by',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='proposed_by_user', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='appointment',
            name='proposed_date',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='appointment',
            name='proposed_salary',
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=22, null=True),
        ),
        migrations.AddField(
            model_name='appointment',
            name='ready_for_hcm',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='appointment',
            name='ready_for_hcm_date',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='appointment',
            name='record_no',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='appointment',
            name='sch_account_num',
            field=models.CharField(blank=True, max_length=6, null=True),
        ),
        migrations.CreateModel(
            name='JobClassCode',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('modified_at', models.DateTimeField(auto_now=True)),
                ('code', models.CharField(max_length=5)),
                ('name', models.CharField(max_length=30)),
                ('modified_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='EmploymentType',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('modified_at', models.DateTimeField(auto_now=True)),
                ('name', models.CharField(max_length=30)),
                ('modified_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='AppointeeRole',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('modified_at', models.DateTimeField(auto_now=True)),
                ('name', models.CharField(max_length=255)),
                ('modified_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.AddField(
            model_name='appointment',
            name='academic_year_title',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='appointment.AcademicYearTitle'),
        ),
        migrations.AddField(
            model_name='appointment',
            name='appointment_type',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='appointment.AppointmentType'),
        ),
        migrations.AddField(
            model_name='appointment',
            name='background_collateral_type',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='appointment.BackgroundCollateralType'),
        ),
        migrations.AddField(
            model_name='appointment',
            name='employment_type',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='appointment.EmploymentType'),
        ),
        migrations.AddField(
            model_name='appointment',
            name='instr_app_job_class_code',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='appointment.JobClassCode'),
        ),
        migrations.AddField(
            model_name='appointment',
            name='instr_role',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='appointment.AppointeeRole'),
        ),
        migrations.AddField(
            model_name='appointment',
            name='lecturer_fellow_pay_option',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='appointment.LecturerFellowPayOption'),
        ),
    ]
# Generated by Django 3.2.23 on 2023-11-09 09:07

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone
import simple_history.models


class Migration(migrations.Migration):

    dependencies = [
        ('department', '0002_auto_20230913_1444'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('course', '0008_auto_20231005_0622'),
    ]

    operations = [
        migrations.CreateModel(
            name='HistoricalTuition',
            fields=[
                ('id', models.IntegerField(auto_created=True, blank=True, db_index=True, verbose_name='ID')),
                ('created_at', models.DateTimeField(blank=True, editable=False)),
                ('modified_at', models.DateTimeField(blank=True, editable=False)),
                ('year', models.PositiveIntegerField()),
                ('term', models.IntegerField(choices=[(0, 'Winter'), (1, 'Spring'), (7, 'Summer'), (9, 'Fall')])),
                ('tuition_fees', models.DecimalField(decimal_places=2, max_digits=10)),
                ('history_id', models.AutoField(primary_key=True, serialize=False)),
                ('history_date', models.DateTimeField(db_index=True)),
                ('history_change_reason', models.CharField(max_length=100, null=True)),
                ('history_type', models.CharField(choices=[('+', 'Created'), ('~', 'Changed'), ('-', 'Deleted')], max_length=1)),
                ('history_user', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='+', to=settings.AUTH_USER_MODEL)),
                ('modified_by', models.ForeignKey(blank=True, db_constraint=False, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='+', to=settings.AUTH_USER_MODEL)),
                ('offering_unit', models.ForeignKey(blank=True, db_constraint=False, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='+', to='course.offeringunit')),
            ],
            options={
                'verbose_name': 'historical tuition',
                'verbose_name_plural': 'historical tuitions',
                'ordering': ('-history_date', '-history_id'),
                'get_latest_by': ('history_date', 'history_id'),
            },
            bases=(simple_history.models.HistoricalChanges, models.Model),
        ),
        migrations.CreateModel(
            name='HistoricalSctnSubtitle',
            fields=[
                ('id', models.IntegerField(auto_created=True, blank=True, db_index=True, verbose_name='ID')),
                ('created_at', models.DateTimeField(blank=True, editable=False)),
                ('modified_at', models.DateTimeField(blank=True, editable=False)),
                ('year', models.CharField(max_length=4)),
                ('term', models.IntegerField(choices=[(0, 'Winter'), (1, 'Spring'), (7, 'Summer'), (9, 'Fall')])),
                ('offering_unit_cd', models.CharField(max_length=2)),
                ('subj_cd', models.CharField(max_length=3)),
                ('course_no', models.CharField(max_length=3)),
                ('section_no', models.CharField(max_length=2)),
                ('supplment_cd', models.CharField(blank=True, max_length=2, null=True)),
                ('subtitle_descr', models.CharField(blank=True, max_length=40, null=True)),
                ('subtopic_course_descr', models.TextField(blank=True, null=True)),
                ('history_id', models.AutoField(primary_key=True, serialize=False)),
                ('history_date', models.DateTimeField(db_index=True)),
                ('history_change_reason', models.CharField(max_length=100, null=True)),
                ('history_type', models.CharField(choices=[('+', 'Created'), ('~', 'Changed'), ('-', 'Deleted')], max_length=1)),
                ('course_section', models.ForeignKey(blank=True, db_constraint=False, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='+', to='course.coursesection')),
                ('history_user', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='+', to=settings.AUTH_USER_MODEL)),
                ('modified_by', models.ForeignKey(blank=True, db_constraint=False, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='+', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'historical sctn subtitle',
                'verbose_name_plural': 'historical sctn subtitles',
                'ordering': ('-history_date', '-history_id'),
                'get_latest_by': ('history_date', 'history_id'),
            },
            bases=(simple_history.models.HistoricalChanges, models.Model),
        ),
        migrations.CreateModel(
            name='HistoricalOfferingUnit',
            fields=[
                ('id', models.IntegerField(auto_created=True, blank=True, db_index=True, verbose_name='ID')),
                ('created_at', models.DateTimeField(blank=True, editable=False)),
                ('modified_at', models.DateTimeField(blank=True, editable=False)),
                ('offering_unit_cd', models.CharField(max_length=2)),
                ('offering_unit_campus', models.CharField(max_length=2)),
                ('offering_unit_level', models.CharField(blank=True, max_length=1, null=True)),
                ('offering_unit_descr', models.CharField(blank=True, max_length=40, null=True)),
                ('home_campus', models.CharField(max_length=2)),
                ('history_id', models.AutoField(primary_key=True, serialize=False)),
                ('history_date', models.DateTimeField(db_index=True)),
                ('history_change_reason', models.CharField(max_length=100, null=True)),
                ('history_type', models.CharField(choices=[('+', 'Created'), ('~', 'Changed'), ('-', 'Deleted')], max_length=1)),
                ('history_user', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='+', to=settings.AUTH_USER_MODEL)),
                ('modified_by', models.ForeignKey(blank=True, db_constraint=False, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='+', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'historical offering unit',
                'verbose_name_plural': 'historical offering units',
                'ordering': ('-history_date', '-history_id'),
                'get_latest_by': ('history_date', 'history_id'),
            },
            bases=(simple_history.models.HistoricalChanges, models.Model),
        ),
        migrations.CreateModel(
            name='HistoricalOfferingExpTtl',
            fields=[
                ('id', models.IntegerField(auto_created=True, blank=True, db_index=True, verbose_name='ID')),
                ('created_at', models.DateTimeField(blank=True, editable=False)),
                ('modified_at', models.DateTimeField(blank=True, editable=False)),
                ('year', models.CharField(max_length=4)),
                ('term', models.IntegerField(choices=[(0, 'Winter'), (1, 'Spring'), (7, 'Summer'), (9, 'Fall')])),
                ('offering_unit_cd', models.CharField(max_length=2)),
                ('subj_cd', models.CharField(max_length=3)),
                ('course_no', models.CharField(max_length=3)),
                ('supplment_cd', models.CharField(blank=True, max_length=2, null=True)),
                ('expand_course_title_descr', models.CharField(max_length=80)),
                ('course_descr', models.TextField(blank=True, null=True)),
                ('history_id', models.AutoField(primary_key=True, serialize=False)),
                ('history_date', models.DateTimeField(db_index=True)),
                ('history_change_reason', models.CharField(max_length=100, null=True)),
                ('history_type', models.CharField(choices=[('+', 'Created'), ('~', 'Changed'), ('-', 'Deleted')], max_length=1)),
                ('course_section', models.ForeignKey(blank=True, db_constraint=False, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='+', to='course.coursesection')),
                ('history_user', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='+', to=settings.AUTH_USER_MODEL)),
                ('modified_by', models.ForeignKey(blank=True, db_constraint=False, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='+', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'historical offering exp ttl',
                'verbose_name_plural': 'historical offering exp ttls',
                'ordering': ('-history_date', '-history_id'),
                'get_latest_by': ('history_date', 'history_id'),
            },
            bases=(simple_history.models.HistoricalChanges, models.Model),
        ),
        migrations.CreateModel(
            name='HistoricalCourseSectionDates',
            fields=[
                ('id', models.IntegerField(auto_created=True, blank=True, db_index=True, verbose_name='ID')),
                ('created_at', models.DateTimeField(blank=True, editable=False)),
                ('modified_at', models.DateTimeField(blank=True, editable=False)),
                ('start_date', models.DateField(blank=True, null=True)),
                ('end_date', models.DateField(blank=True, null=True)),
                ('is_highschool_course', models.BooleanField(default=False)),
                ('course_fee', models.FloatField(blank=True, null=True)),
                ('history_id', models.AutoField(primary_key=True, serialize=False)),
                ('history_date', models.DateTimeField(db_index=True)),
                ('history_change_reason', models.CharField(max_length=100, null=True)),
                ('history_type', models.CharField(choices=[('+', 'Created'), ('~', 'Changed'), ('-', 'Deleted')], max_length=1)),
                ('course_fee_type', models.ForeignKey(blank=True, db_constraint=False, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='+', to='course.coursefeetype')),
                ('course_section', models.ForeignKey(blank=True, db_constraint=False, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='+', to='course.coursesection')),
                ('course_status', models.ForeignKey(blank=True, db_constraint=False, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='+', to='course.coursestatustype')),
                ('history_user', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='+', to=settings.AUTH_USER_MODEL)),
                ('modified_by', models.ForeignKey(blank=True, db_constraint=False, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='+', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'historical course section dates',
                'verbose_name_plural': 'historical course section datess',
                'ordering': ('-history_date', '-history_id'),
                'get_latest_by': ('history_date', 'history_id'),
            },
            bases=(simple_history.models.HistoricalChanges, models.Model),
        ),
        migrations.CreateModel(
            name='HistoricalCourseSectionComment',
            fields=[
                ('id', models.IntegerField(auto_created=True, blank=True, db_index=True, verbose_name='ID')),
                ('created_at', models.DateTimeField(blank=True, editable=False)),
                ('modified_at', models.DateTimeField(blank=True, editable=False)),
                ('text', models.TextField()),
                ('hide_from_unit', models.BooleanField(default=False)),
                ('history_id', models.AutoField(primary_key=True, serialize=False)),
                ('history_date', models.DateTimeField(db_index=True)),
                ('history_change_reason', models.CharField(max_length=100, null=True)),
                ('history_type', models.CharField(choices=[('+', 'Created'), ('~', 'Changed'), ('-', 'Deleted')], max_length=1)),
                ('course_section', models.ForeignKey(blank=True, db_constraint=False, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='+', to='course.coursesection')),
                ('history_user', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='+', to=settings.AUTH_USER_MODEL)),
                ('modified_by', models.ForeignKey(blank=True, db_constraint=False, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='+', to=settings.AUTH_USER_MODEL)),
                ('user', models.ForeignKey(blank=True, db_constraint=False, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='+', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'historical course section comment',
                'verbose_name_plural': 'historical course section comments',
                'ordering': ('-history_date', '-history_id'),
                'get_latest_by': ('history_date', 'history_id'),
            },
            bases=(simple_history.models.HistoricalChanges, models.Model),
        ),
        migrations.CreateModel(
            name='HistoricalCourseSection',
            fields=[
                ('id', models.IntegerField(auto_created=True, blank=True, db_index=True, verbose_name='ID')),
                ('year', models.PositiveIntegerField()),
                ('term', models.IntegerField(choices=[(0, 'Winter'), (1, 'Spring'), (7, 'Summer'), (9, 'Fall')])),
                ('reg_index_no', models.CharField(max_length=5)),
                ('offering_unit_cd', models.CharField(blank=True, max_length=2, null=True)),
                ('subj_cd', models.CharField(blank=True, max_length=3, null=True)),
                ('course_no', models.CharField(blank=True, max_length=3, null=True)),
                ('course_suppl_cd', models.CharField(blank=True, max_length=2, null=True)),
                ('section_no', models.CharField(blank=True, max_length=2, null=True)),
                ('course_title', models.CharField(blank=True, max_length=20, null=True)),
                ('credits', models.CharField(blank=True, max_length=3, null=True)),
                ('stop_point', models.CharField(blank=True, max_length=3, null=True)),
                ('regd_enrollment', models.CharField(blank=True, max_length=3, null=True)),
                ('prior_enrollment', models.CharField(blank=True, max_length=3, null=True)),
                ('print_comment_cd', models.CharField(blank=True, max_length=2, null=True)),
                ('print_comment_descr', models.CharField(blank=True, max_length=35, null=True)),
                ('print_comment_cd2', models.CharField(blank=True, max_length=2, null=True)),
                ('print_comment_descr2', models.CharField(blank=True, max_length=35, null=True)),
                ('print_comment_cd3', models.CharField(blank=True, max_length=2, null=True)),
                ('print_comment_descr3', models.CharField(blank=True, max_length=35, null=True)),
                ('print_comment_cd4', models.CharField(blank=True, max_length=2, null=True)),
                ('print_comment_descr4', models.CharField(blank=True, max_length=35, null=True)),
                ('status_cd', models.CharField(blank=True, choices=[('1', 'Active And Available'), ('2', 'Inactive System Not Available'), ('3', 'Inactive Not Available'), ('4', 'Not Available For Online Registration')], max_length=1, null=True)),
                ('status_descr', models.CharField(blank=True, max_length=24, null=True)),
                ('session_id_cd', models.CharField(blank=True, max_length=1, null=True)),
                ('section_note_1', models.CharField(blank=True, max_length=32, null=True)),
                ('section_note_2', models.CharField(blank=True, max_length=32, null=True)),
                ('section_note_3', models.CharField(blank=True, max_length=32, null=True)),
                ('section_note_4', models.CharField(blank=True, max_length=32, null=True)),
                ('cross_list_offering_unit_cd_1', models.CharField(blank=True, max_length=2, null=True)),
                ('cross_list_subj_cd_1', models.CharField(blank=True, max_length=3, null=True)),
                ('cross_list_course_no_1', models.CharField(blank=True, max_length=3, null=True)),
                ('cross_list_section_no_1', models.CharField(blank=True, max_length=2, null=True)),
                ('cross_list_course_suppl_cd_1', models.CharField(blank=True, max_length=2, null=True)),
                ('cross_list_offering_unit_cd_2', models.CharField(blank=True, max_length=2, null=True)),
                ('cross_list_subj_cd_2', models.CharField(blank=True, max_length=3, null=True)),
                ('cross_list_course_no_2', models.CharField(blank=True, max_length=3, null=True)),
                ('cross_list_section_no_2', models.CharField(blank=True, max_length=2, null=True)),
                ('cross_list_course_suppl_cd_2', models.CharField(blank=True, max_length=2, null=True)),
                ('cross_list_offering_unit_cd_3', models.CharField(blank=True, max_length=2, null=True)),
                ('cross_list_subj_cd_3', models.CharField(blank=True, max_length=3, null=True)),
                ('cross_list_course_no_3', models.CharField(blank=True, max_length=3, null=True)),
                ('cross_list_section_no_3', models.CharField(blank=True, max_length=2, null=True)),
                ('cross_list_course_suppl_cd_3', models.CharField(blank=True, max_length=2, null=True)),
                ('cross_list_offering_unit_cd_4', models.CharField(blank=True, max_length=2, null=True)),
                ('cross_list_subj_cd_4', models.CharField(blank=True, max_length=3, null=True)),
                ('cross_list_course_no_4', models.CharField(blank=True, max_length=3, null=True)),
                ('cross_list_section_no_4', models.CharField(blank=True, max_length=2, null=True)),
                ('cross_list_course_suppl_cd_4', models.CharField(blank=True, max_length=2, null=True)),
                ('proj_enrollment', models.CharField(blank=True, max_length=3, null=True)),
                ('cms_type_cd', models.CharField(blank=True, choices=[('A', 'Pearson Managed Program Online Course'), ('B', 'Blackboard'), ('C', 'Canvas'), ('M', 'Moodle'), ('P', 'Non Managed Pearson'), ('S', 'Sakai')], max_length=1, null=True)),
                ('course_type_cd', models.CharField(blank=True, choices=[('01', 'Online'), ('02', 'Hybrid'), ('03', 'Remote Instruction'), ('04', 'Aproved In Person'), ('05', 'Independent Learning'), ('06', 'Face To Face'), ('07', 'Converged Learning Face To Face'), ('08', 'Converged Learning Hybrid'), ('09', 'Converged Learning Online'), ('99', 'Non Instructional')], max_length=2, null=True)),
                ('appointment_required', models.BooleanField(default=True)),
                ('created_at', models.DateTimeField(default=django.utils.timezone.now)),
                ('modified_at', models.DateTimeField(blank=True, editable=False)),
                ('history_id', models.AutoField(primary_key=True, serialize=False)),
                ('history_date', models.DateTimeField(db_index=True)),
                ('history_change_reason', models.CharField(max_length=100, null=True)),
                ('history_type', models.CharField(choices=[('+', 'Created'), ('~', 'Changed'), ('-', 'Deleted')], max_length=1)),
                ('department', models.ForeignKey(blank=True, db_constraint=False, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='+', to='department.department')),
                ('history_user', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='+', to=settings.AUTH_USER_MODEL)),
                ('modified_by', models.ForeignKey(blank=True, db_constraint=False, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='+', to=settings.AUTH_USER_MODEL)),
                ('offering_unit', models.ForeignKey(blank=True, db_constraint=False, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='+', to='course.offeringunit')),
            ],
            options={
                'verbose_name': 'historical course section',
                'verbose_name_plural': 'historical course sections',
                'ordering': ('-history_date', '-history_id'),
                'get_latest_by': ('history_date', 'history_id'),
            },
            bases=(simple_history.models.HistoricalChanges, models.Model),
        ),
        migrations.CreateModel(
            name='HistoricalCoursePrereq',
            fields=[
                ('id', models.IntegerField(auto_created=True, blank=True, db_index=True, verbose_name='ID')),
                ('created_at', models.DateTimeField(blank=True, editable=False)),
                ('modified_at', models.DateTimeField(blank=True, editable=False)),
                ('year', models.PositiveIntegerField()),
                ('term', models.IntegerField(choices=[(0, 'Winter'), (1, 'Spring'), (7, 'Summer'), (9, 'Fall')])),
                ('offering_unit_cd', models.CharField(max_length=2)),
                ('subj_cd', models.CharField(max_length=3)),
                ('course_no', models.CharField(max_length=3)),
                ('prereq1_unit', models.CharField(blank=True, max_length=2, null=True)),
                ('prereq1_subj', models.CharField(blank=True, max_length=3, null=True)),
                ('prereq1_course', models.CharField(blank=True, max_length=3, null=True)),
                ('prereq1_boolean', models.CharField(blank=True, max_length=1, null=True)),
                ('prereq2_unit', models.CharField(blank=True, max_length=2, null=True)),
                ('prereq2_subj', models.CharField(blank=True, max_length=3, null=True)),
                ('prereq2_course', models.CharField(blank=True, max_length=3, null=True)),
                ('prereq2_boolean', models.CharField(blank=True, max_length=1, null=True)),
                ('prereq3_unit', models.CharField(blank=True, max_length=2, null=True)),
                ('prereq3_subj', models.CharField(blank=True, max_length=3, null=True)),
                ('prereq3_course', models.CharField(blank=True, max_length=3, null=True)),
                ('prereq3_boolean', models.CharField(blank=True, max_length=1, null=True)),
                ('prereq4_unit', models.CharField(blank=True, max_length=2, null=True)),
                ('prereq4_subj', models.CharField(blank=True, max_length=3, null=True)),
                ('prereq4_course', models.CharField(blank=True, max_length=3, null=True)),
                ('prereq4_boolean', models.CharField(blank=True, max_length=1, null=True)),
                ('prereq5_unit', models.CharField(blank=True, max_length=2, null=True)),
                ('prereq5_subj', models.CharField(blank=True, max_length=3, null=True)),
                ('prereq5_course', models.CharField(blank=True, max_length=3, null=True)),
                ('prereq5_boolean', models.CharField(blank=True, max_length=1, null=True)),
                ('prereq6_unit', models.CharField(blank=True, max_length=2, null=True)),
                ('prereq6_subj', models.CharField(blank=True, max_length=3, null=True)),
                ('prereq6_course', models.CharField(blank=True, max_length=3, null=True)),
                ('prereq6_boolean', models.CharField(blank=True, max_length=1, null=True)),
                ('prereq7_unit', models.CharField(blank=True, max_length=2, null=True)),
                ('prereq7_subj', models.CharField(blank=True, max_length=3, null=True)),
                ('prereq7_course', models.CharField(blank=True, max_length=3, null=True)),
                ('prereq7_boolean', models.CharField(blank=True, max_length=1, null=True)),
                ('prereq8_unit', models.CharField(blank=True, max_length=2, null=True)),
                ('prereq8_subj', models.CharField(blank=True, max_length=3, null=True)),
                ('prereq8_course', models.CharField(blank=True, max_length=3, null=True)),
                ('prereq8_boolean', models.CharField(blank=True, max_length=1, null=True)),
                ('prereq9_unit', models.CharField(blank=True, max_length=2, null=True)),
                ('prereq9_subj', models.CharField(blank=True, max_length=3, null=True)),
                ('prereq9_course', models.CharField(blank=True, max_length=3, null=True)),
                ('prereq9_boolean', models.CharField(blank=True, max_length=1, null=True)),
                ('prereq10_unit', models.CharField(blank=True, max_length=2, null=True)),
                ('prereq10_subj', models.CharField(blank=True, max_length=3, null=True)),
                ('prereq10_course', models.CharField(blank=True, max_length=3, null=True)),
                ('prereq10_boolean', models.CharField(blank=True, max_length=1, null=True)),
                ('prereq11_unit', models.CharField(blank=True, max_length=2, null=True)),
                ('prereq11_subj', models.CharField(blank=True, max_length=3, null=True)),
                ('prereq11_course', models.CharField(blank=True, max_length=3, null=True)),
                ('prereq11_boolean', models.CharField(blank=True, max_length=1, null=True)),
                ('prereq12_unit', models.CharField(blank=True, max_length=2, null=True)),
                ('prereq12_subj', models.CharField(blank=True, max_length=3, null=True)),
                ('prereq12_course', models.CharField(blank=True, max_length=3, null=True)),
                ('prereq12_boolean', models.CharField(blank=True, max_length=1, null=True)),
                ('prereq13_unit', models.CharField(blank=True, max_length=2, null=True)),
                ('prereq13_subj', models.CharField(blank=True, max_length=3, null=True)),
                ('prereq13_course', models.CharField(blank=True, max_length=3, null=True)),
                ('prereq13_boolean', models.CharField(blank=True, max_length=1, null=True)),
                ('prereq14_unit', models.CharField(blank=True, max_length=2, null=True)),
                ('prereq14_subj', models.CharField(blank=True, max_length=3, null=True)),
                ('prereq14_course', models.CharField(blank=True, max_length=3, null=True)),
                ('prereq14_boolean', models.CharField(blank=True, max_length=1, null=True)),
                ('prereq15_unit', models.CharField(blank=True, max_length=2, null=True)),
                ('prereq15_subj', models.CharField(blank=True, max_length=3, null=True)),
                ('prereq15_course', models.CharField(blank=True, max_length=3, null=True)),
                ('prereq15_boolean', models.CharField(blank=True, max_length=1, null=True)),
                ('prereq16_unit', models.CharField(blank=True, max_length=2, null=True)),
                ('prereq16_subj', models.CharField(blank=True, max_length=3, null=True)),
                ('prereq16_course', models.CharField(blank=True, max_length=3, null=True)),
                ('prereq16_boolean', models.CharField(blank=True, max_length=1, null=True)),
                ('prereq17_unit', models.CharField(blank=True, max_length=2, null=True)),
                ('prereq17_subj', models.CharField(blank=True, max_length=3, null=True)),
                ('prereq17_course', models.CharField(blank=True, max_length=3, null=True)),
                ('prereq17_boolean', models.CharField(blank=True, max_length=1, null=True)),
                ('prereq18_unit', models.CharField(blank=True, max_length=2, null=True)),
                ('prereq18_subj', models.CharField(blank=True, max_length=3, null=True)),
                ('prereq18_course', models.CharField(blank=True, max_length=3, null=True)),
                ('prereq18_boolean', models.CharField(blank=True, max_length=1, null=True)),
                ('prereq19_unit', models.CharField(blank=True, max_length=2, null=True)),
                ('prereq19_subj', models.CharField(blank=True, max_length=3, null=True)),
                ('prereq19_course', models.CharField(blank=True, max_length=3, null=True)),
                ('prereq19_boolean', models.CharField(blank=True, max_length=1, null=True)),
                ('prereq20_unit', models.CharField(blank=True, max_length=2, null=True)),
                ('prereq20_subj', models.CharField(blank=True, max_length=3, null=True)),
                ('prereq20_course', models.CharField(blank=True, max_length=3, null=True)),
                ('prereq20_boolean', models.CharField(blank=True, max_length=1, null=True)),
                ('prereq21_unit', models.CharField(blank=True, max_length=2, null=True)),
                ('prereq21_subj', models.CharField(blank=True, max_length=3, null=True)),
                ('prereq21_course', models.CharField(blank=True, max_length=3, null=True)),
                ('prereq21_boolean', models.CharField(blank=True, max_length=1, null=True)),
                ('prereq22_unit', models.CharField(blank=True, max_length=2, null=True)),
                ('prereq22_subj', models.CharField(blank=True, max_length=3, null=True)),
                ('prereq22_course', models.CharField(blank=True, max_length=3, null=True)),
                ('prereq22_boolean', models.CharField(blank=True, max_length=1, null=True)),
                ('prereq23_unit', models.CharField(blank=True, max_length=2, null=True)),
                ('prereq23_subj', models.CharField(blank=True, max_length=3, null=True)),
                ('prereq23_course', models.CharField(blank=True, max_length=3, null=True)),
                ('prereq23_boolean', models.CharField(blank=True, max_length=1, null=True)),
                ('prereq24_unit', models.CharField(blank=True, max_length=2, null=True)),
                ('prereq24_subj', models.CharField(blank=True, max_length=3, null=True)),
                ('prereq24_course', models.CharField(blank=True, max_length=3, null=True)),
                ('prereq24_boolean', models.CharField(blank=True, max_length=1, null=True)),
                ('boolean_pattern_cd', models.CharField(blank=True, max_length=2, null=True)),
                ('course_suppl_cd', models.CharField(max_length=2)),
                ('history_id', models.AutoField(primary_key=True, serialize=False)),
                ('history_date', models.DateTimeField(db_index=True)),
                ('history_change_reason', models.CharField(max_length=100, null=True)),
                ('history_type', models.CharField(choices=[('+', 'Created'), ('~', 'Changed'), ('-', 'Deleted')], max_length=1)),
                ('course_section', models.ForeignKey(blank=True, db_constraint=False, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='+', to='course.coursesection')),
                ('history_user', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='+', to=settings.AUTH_USER_MODEL)),
                ('modified_by', models.ForeignKey(blank=True, db_constraint=False, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='+', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'historical course prereq',
                'verbose_name_plural': 'historical course prereqs',
                'ordering': ('-history_date', '-history_id'),
                'get_latest_by': ('history_date', 'history_id'),
            },
            bases=(simple_history.models.HistoricalChanges, models.Model),
        ),
        migrations.CreateModel(
            name='HistoricalCourseMtg',
            fields=[
                ('id', models.IntegerField(auto_created=True, blank=True, db_index=True, verbose_name='ID')),
                ('created_at', models.DateTimeField(blank=True, editable=False)),
                ('modified_at', models.DateTimeField(blank=True, editable=False)),
                ('year', models.PositiveIntegerField()),
                ('term', models.IntegerField(choices=[(0, 'Winter'), (1, 'Spring'), (7, 'Summer'), (9, 'Fall')])),
                ('reg_index_no', models.CharField(blank=True, max_length=5, null=True)),
                ('mtg_day', models.CharField(blank=True, choices=[('F', 'Friday'), ('H', 'Thursday'), ('M', 'Monday'), ('S', 'Saturday'), ('T', 'Tuesday'), ('U', 'Sunday'), ('W', 'Wednesday')], max_length=1, null=True)),
                ('start_time', models.CharField(blank=True, max_length=4, null=True)),
                ('pm_code', models.CharField(blank=True, choices=[('A', 'Before Noon'), ('P', 'Pm Hours')], max_length=1, null=True)),
                ('end_time', models.CharField(blank=True, max_length=4, null=True)),
                ('bldg_cd', models.CharField(blank=True, max_length=3, null=True)),
                ('room_no', models.CharField(blank=True, max_length=4, null=True)),
                ('meeting_mode_cd', models.CharField(blank=True, choices=[('02', 'Lecture'), ('03', 'Discussion Recitation'), ('04', 'Seminar'), ('05', 'Laboratory'), ('06', 'Language Workshop'), ('07', 'Studio Art Theatre Dance'), ('08', 'Individual Music Lessons'), ('09', 'Group Music Lessons'), ('10', 'Physical Education For Majors'), ('11', 'Physical Education For Non Majors'), ('12', 'Practice Teaching For One Half Semester'), ('13', 'Practice Teaching For Full Semester'), ('14', 'Field Work'), ('15', 'Internship'), ('16', 'Clinic'), ('17', 'College Agency'), ('18', 'Readings'), ('19', 'Individual Project'), ('20', 'Group Project'), ('21', 'Honors'), ('23', 'Research For Thesis Dissertation'), ('24', 'Individual Music Lessons Mgsa'), ('25', 'Professional Psychology Practicum'), ('26', 'Professional Psychology Demonstration'), ('27', 'Workshop'), ('28', 'Film'), ('29', 'Study Abroad'), ('90', 'Online Instruction'), ('91', 'Hybrid Section'), ('92', 'Remote Synchronous'), ('93', 'Remote Asynchronous'), ('99', 'No Instructional Component')], max_length=2, null=True)),
                ('campus_location', models.CharField(blank=True, choices=[('1', 'College Avenue'), ('2', 'Busch'), ('3', 'Livingston'), ('4', 'Douglass Cook'), ('5', 'Downtown New Brunswick'), ('6', 'Camden'), ('7', 'Newark'), ('8', 'Western Monmouth'), ('9', 'Camden County College Blackwood Campus'), ('A', 'Atlantic City Mays Landing Court House'), ('B', 'Burlington County Community College Mt Laurel'), ('C', 'Cumberland County College'), ('D', 'Mercer County College'), ('E', 'Ru At The Shore'), ('H', 'County College Of Morris'), ('J', 'Joint Base Mcguire Dix Lakehurst Ru Jbmdl'), ('L', 'Brookdale County Community College Lincroft'), ('M', 'Morris County School Of Technology'), ('N', 'New Jersey Institute Of Technology'), ('O', 'Online'), ('P', 'Point Pleasant Beach'), ('Q', 'China'), ('R', 'Raritan Valley Community College'), ('S', 'Study Abroad'), ('T', 'Remote Instruction'), ('W', 'Rutgers Biomedical And Health Sciences Newark'), ('Z', 'Off Campus')], max_length=1, null=True)),
                ('campus_name', models.CharField(blank=True, max_length=50, null=True)),
                ('campus_abbrev', models.CharField(blank=True, max_length=3, null=True)),
                ('history_id', models.AutoField(primary_key=True, serialize=False)),
                ('history_date', models.DateTimeField(db_index=True)),
                ('history_change_reason', models.CharField(max_length=100, null=True)),
                ('history_type', models.CharField(choices=[('+', 'Created'), ('~', 'Changed'), ('-', 'Deleted')], max_length=1)),
                ('course_section', models.ForeignKey(blank=True, db_constraint=False, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='+', to='course.coursesection')),
                ('history_user', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='+', to=settings.AUTH_USER_MODEL)),
                ('modified_by', models.ForeignKey(blank=True, db_constraint=False, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='+', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'historical course mtg',
                'verbose_name_plural': 'historical course mtgs',
                'ordering': ('-history_date', '-history_id'),
                'get_latest_by': ('history_date', 'history_id'),
            },
            bases=(simple_history.models.HistoricalChanges, models.Model),
        ),
    ]

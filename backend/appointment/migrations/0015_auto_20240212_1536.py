# Generated by Django 3.2.24 on 2024-02-12 15:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('appointment', '0014_alter_appointmentpastsalary_term'),
    ]

    operations = [
        migrations.AlterField(
            model_name='historicalinstructor',
            name='cell_phone',
            field=models.CharField(blank=True, max_length=25, null=True, verbose_name='Cell #'),
        ),
        migrations.AlterField(
            model_name='historicalinstructor',
            name='primary_phone',
            field=models.CharField(max_length=25, verbose_name='Primary Phone #'),
        ),
        migrations.AlterField(
            model_name='historicalinstructor',
            name='work_phone',
            field=models.CharField(blank=True, max_length=25, null=True, verbose_name='Work #'),
        ),
        migrations.AlterField(
            model_name='instructor',
            name='cell_phone',
            field=models.CharField(blank=True, max_length=25, null=True, verbose_name='Cell #'),
        ),
        migrations.AlterField(
            model_name='instructor',
            name='primary_phone',
            field=models.CharField(max_length=25, verbose_name='Primary Phone #'),
        ),
        migrations.AlterField(
            model_name='instructor',
            name='work_phone',
            field=models.CharField(blank=True, max_length=25, null=True, verbose_name='Work #'),
        ),
    ]
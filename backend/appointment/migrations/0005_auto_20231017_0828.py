# Generated by Django 2.2.28 on 2023-10-17 08:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('appointment', '0004_auto_20231009_0637'),
    ]

    operations = [
        migrations.AlterField(
            model_name='instructor',
            name='ssn',
            field=models.CharField(blank=True, max_length=9, null=True, verbose_name='Social Security Number'),
        ),
    ]

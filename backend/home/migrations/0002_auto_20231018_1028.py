# Generated by Django 2.2.28 on 2023-10-18 10:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='emailtemplate',
            name='message',
            field=models.TextField(blank=True, null=True),
        ),
    ]

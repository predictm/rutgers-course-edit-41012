# Generated by Django 2.2.28 on 2023-11-03 03:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounting', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='accounting',
            name='gl_string',
            field=models.CharField(help_text='Generated GL string in the format: Unit [3]-Division [4]-Organization [4]-Location [4]-Fund Type [3]-Business Line [4]-Account [5]', max_length=55, verbose_name='GL String'),
        ),
        migrations.AlterField(
            model_name='historicalaccounting',
            name='gl_string',
            field=models.CharField(help_text='Generated GL string in the format: Unit [3]-Division [4]-Organization [4]-Location [4]-Fund Type [3]-Business Line [4]-Account [5]', max_length=55, verbose_name='GL String'),
        ),
    ]
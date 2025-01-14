# Generated by Django 3.2.23 on 2024-01-10 04:16

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('appointment', '0009_auto_20240104_1405'),
    ]

    operations = [
        migrations.CreateModel(
            name='SalaryPaymentAlternative',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=250)),
            ],
        ),
        migrations.AddField(
            model_name='appointment',
            name='salary_payment_alternative',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='appointment.salarypaymentalternative'),
        ),
        migrations.AddField(
            model_name='historicalappointment',
            name='salary_payment_alternative',
            field=models.ForeignKey(blank=True, db_constraint=False, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='+', to='appointment.salarypaymentalternative'),
        ),
    ]

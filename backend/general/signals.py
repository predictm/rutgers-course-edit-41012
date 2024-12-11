from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from appointment.models import Appointment, Instructor
from django.contrib.auth.hashers import make_password
from general.enum_helper import AppointmentStatus
from general.utils import replace_tokens, send_email, update_contracts
from home.models import EmailTemplate
from notification.models import Notification
from rutgers_course_edit_41012.settings import DEFAULT_FROM_EMAIL, SECRET_KEY
from users.models import User
from cryptography.fernet import Fernet
from django.core.mail import EmailMultiAlternatives



encryption_secret = b'EBSdzExHqPGrfSrP1Caui2Fhh9LPojxBcwjUfivdOCU='
cipher_suite = Fernet(encryption_secret)


class Signals:
    
    @receiver(post_save, sender=User)
    def send_welcome_user_email(sender, instance, created, **kwargs):
        if created:
            template = EmailTemplate.objects.filter(email_type='New User').first()
            if template:
                subject = template.subject
                to = replace_tokens(template.to, instance)
                message = replace_tokens(template.message, instance)
                recipient_list = [to]
                # Create the email message
                email = EmailMultiAlternatives(subject, message, DEFAULT_FROM_EMAIL, recipient_list)
                email.attach_alternative(message, "text/html")  # Set the email content as HTML
                # Send the email
                email.send()

    @receiver(post_save, sender=Instructor)
    def encrypt_ssn(sender, instance, created, **kwargs):
        if created and instance.ssn:
            encrypted_value = cipher_suite.encrypt(instance.ssn.encode('utf-8')).decode('utf-8')
            # encrypted_value = make_password(instance.ssn)
            instance.ssn = encrypted_value
            instance.save()

    @receiver(post_save, sender=Appointment)
    def create_notification_for_approval(sender, instance, created, **kwargs):
        if not created and instance.approved:
            # The department user who assigned the instructor
            proposed_by = instance.proposed_by.get_full_name() if instance.proposed_by else "Unknown"
            # The admin who approved the salary
            approved_by = instance.approved_by.get_full_name() if instance.approved_by else "Unknown"
            # Notification message
            message = (
                f"{instance.course_section.year}-{instance.course_section.term}-"
                f"{instance.course_section.offering_unit_cd}-{instance.course_section.subj_cd}-"
                f"{instance.course_section.course_no}-{instance.course_section.section_no}-"
                f"{instance.course_section.course_title} {approved_by} "
                f"approved this course for the approved salary ${instance.approved_salary:,}."
            )
            # Create Notification for the admin who assigned the instructor
            Notification.objects.create(
                user=instance.proposed_by,
                title="Instructor Approved",
                notification_type="INSTRUCTOR_APPROVED",
                message=message,
            )
            # Create Notification for the department user
            Notification.objects.create(
                user=instance.approved_by,
                title="Instructor Approved",
                notification_type="INSTRUCTOR_APPROVED",
                message=message,
            )

    @receiver(pre_save, sender=Appointment)
    def update_contract_appointment(sender, instance, **kwargs):
        if instance.pk:
            update_contracts(instance.id, instance)

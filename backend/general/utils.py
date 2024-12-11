import threading
from django.core.mail import EmailMessage
from django.contrib.contenttypes.models import ContentType
from home.models import AvailableToken
from appointment.models import Appointment
from contract.models import Contract, ContractTemplate
from course.models import Semester
from general.enum_helper import AppointmentStatus, ContractTemplateType
from django.db import transaction
from django.db.models import Q


def replace_tokens(template_message, model_instance):
    tokens = AvailableToken.objects.filter(content_type=ContentType.objects.get_for_model(model_instance))
    token_dict = {}
    for token in tokens:
        field_name = token.field_name
        if hasattr(model_instance, field_name):
            field_value = getattr(model_instance, field_name)
            token_dict[token.token] = field_value
    for token, value in token_dict.items():
        template_message = template_message.replace(f"[{token}]", str(value))
    return template_message

def send_email(subject, message, recipient_list):
    email = EmailMessage(subject=subject, body=message, to=recipient_list)
    email.send()


def update_contracts(appointment_id, instance):
    with transaction.atomic():
        original_instance = Appointment.objects.get(pk=instance.pk)
        return _update_contracts(original_instance, instance)

def _update_contracts(original_instance, instance):
    if (
        original_instance.approved_salary != instance.approved_salary or
        original_instance.appointment_status != instance.appointment_status
    ):
        old_contracts = original_instance.instructor.contracts.filter(is_active=True)

        if old_contracts:
            current_semester = Semester.objects.filter(is_current_semester=True).first()
            if not current_semester or (
                original_instance.course_section.year != current_semester.year or
                original_instance.course_section.term != current_semester.term
            ):
                return

            appointments_query = Q(
                instructor=original_instance.instructor,
                approved=True,
                is_assigned=True,
                course_section__year=current_semester.year,
                course_section__term=current_semester.term,
                appointment_status=AppointmentStatus.APPROVED
            )

            if instance.appointment_status == AppointmentStatus.PENDING.value:
                appointments_query &= ~Q(pk=instance.pk)
            elif instance.appointment_status == AppointmentStatus.APPROVED.value:
                appointments_query |= Q(pk=instance.pk)
            appointments = Appointment.objects.filter(appointments_query).order_by('-created_at')
            if not appointments:
                old_contracts.update(is_active=False)
                return

            first_appointment = appointments.first()
            contract_template = _get_contract_template(first_appointment)

            if contract_template:
                previous_contract = old_contracts.first() if old_contracts else None
                old_contracts.update(is_active=False)
                new_contract = Contract.objects.create(
                    instructor=original_instance.instructor,
                    contract_template=contract_template,
                    is_active=True,
                    previous_contract=previous_contract,
                )
                new_contract.appointments.set(appointments)
                new_contract.save()
                return new_contract.id


def _get_contract_template(appointment):
    if (
        appointment.primary_instructor and
        appointment.instr_app_job_class_code.code in ['93000', '93001', '93002']
    ):
        return ContractTemplate.objects.filter(
            template_type=ContractTemplateType.UNION_CONTRACT,
            is_active=True
        ).first()
    elif (
        appointment.primary_instructor and
        appointment.instr_app_job_class_code.code == '00000'
    ):
        return ContractTemplate.objects.filter(
            template_type=ContractTemplateType.ON_LOAD_CONTRACT,
            is_active=True
        ).first()
    else:
        return ContractTemplate.objects.filter(
            template_type=ContractTemplateType.NON_UNION_CONTRACT,
            is_active=True
        ).first()

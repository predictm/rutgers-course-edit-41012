from celery import shared_task
from contract.models import Contract
from general.enum_helper import  ContractStatus
from django.utils import timezone
import base64
from django.core.files.base import ContentFile
from django.db.models import Q


@shared_task
def mark_contract_as_signed(document, envelope_id):
    contracts = Contract.objects.filter(envelope_id=envelope_id)
    if not contracts:
        return {"error": "No contract with envelope id is present"}
    elif contracts.count() > 1:
        return {"error": "Multiple contracts found"}
    else:
        contract = contracts.first()
        if contract.status != ContractStatus.SEND_FOR_SIGNATURE.value or contract.is_signed:
            return {"error": "Contract is not sent for signature"}
        contract.status = ContractStatus.HCM_READY.value
        contract.date_hcm_ready = timezone.now()
        contract.is_signed = True
        contract.save()
        contract.signed_document.save('signed_contract.pdf', ContentFile(base64.b64decode(document)))
        return {"success": "Contract signed successfully"}


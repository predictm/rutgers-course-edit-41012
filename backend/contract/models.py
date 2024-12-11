from django.db import models
from general.models import BaseModel
from general.enum_helper import ContractTemplateType, ContractStatus
from django.contrib.auth import get_user_model
from simple_history.models import HistoricalRecords
from appointment.models import Instructor, Appointment

User = get_user_model()


class ContractTemplate(BaseModel):
    template_type = models.CharField(max_length=100, choices=ContractTemplateType.choices())
    content = models.TextField()
    default_content = models.TextField(null=True, blank=True)
    is_active = models.BooleanField(default=False)

    def reset_to_default(self):
        self.content = self.default_content
        self.save()

    def save(self, *args, **kwargs):
        if self.is_active:
            ContractTemplate.objects.filter(template_type=self.template_type, is_active=True).update(is_active=False)
        super(ContractTemplate, self).save(*args, **kwargs)

    def __str__(self):
        return self.template_type


class Contract(BaseModel):
    instructor = models.ForeignKey(Instructor, on_delete=models.CASCADE, related_name='contracts')
    appointments = models.ManyToManyField(Appointment, related_name='contracts')
    contract_template = models.ForeignKey(ContractTemplate, on_delete=models.CASCADE, related_name='contracts')
    status = models.CharField(max_length=20, choices=ContractStatus.choices(), default=ContractStatus.DRAFT.value)
    previous_contract = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True)
    is_active = models.BooleanField(default=False)
    is_signed = models.BooleanField(default=False)
    date_signed = models.DateTimeField(null=True, blank=True)
    envelope_id = models.CharField(max_length=100, null=True, blank=True)
    signed_document = models.FileField(upload_to='contracts/signed/', null=True, blank=True)
    date_send_for_signature = models.DateTimeField(null=True, blank=True)
    date_hcm_ready = models.DateTimeField(null=True, blank=True)
    date_hcm_entered = models.DateTimeField(null=True, blank=True)
    hcm_entered_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='contracts_hcm_entered')
    send_for_signature_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True,
                                              related_name='contracts_sent')
    history = HistoricalRecords()

    @property
    def _history_user(self):
        return self.modified_by

    @_history_user.setter
    def _history_user(self, value):
        self.modified_by = value


class DocusignKey(BaseModel):
    private_key = models.TextField()
    history = HistoricalRecords()

    @property
    def _history_user(self):
        return self.modified_by

    @_history_user.setter
    def _history_user(self, value):
        self.modified_by = value

    class Meta:
        verbose_name = 'Docusign Key'
        verbose_name_plural = 'Docusign Keys'
        ordering = ['-created_at']

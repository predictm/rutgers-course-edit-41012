from django.db import models
from course.models import OfferingUnit
from department.models import Department
from general.models import BaseModel
from simple_history.models import HistoricalRecords


class Accounting(BaseModel):
    offering_unit = models.ForeignKey(OfferingUnit, on_delete=models.CASCADE, verbose_name="Offering Unit")
    department = models.ForeignKey(Department, on_delete=models.CASCADE, verbose_name="Department", null=True, blank=True)
    unit_cd = models.CharField(max_length=3, verbose_name="Unit Code", help_text="3-character unit code")
    division = models.CharField(max_length=4, verbose_name="Division", help_text="4-character division code")
    organization = models.CharField(max_length=4, verbose_name="Organization", help_text="4-character organization code")
    location = models.CharField(max_length=4, verbose_name="Location", help_text="4-character location code")
    fund_type = models.CharField(max_length=3, verbose_name="Fund Type", help_text="3-character fund type code")
    business_line = models.CharField(max_length=4, verbose_name="Business Line", help_text="4-character business line code")
    account = models.CharField(max_length=5, verbose_name="Account", help_text="5-character account code")
    gl_string = models.CharField(max_length=55, verbose_name="GL String", help_text="Generated GL string in the format: Unit [3]-Division [4]-Organization [4]-Location [4]-Fund Type [3]-Business Line [4]-Account [5]")
    history = HistoricalRecords()

    def save(self, *args, **kwargs):
        # Generate the GL string based on the field values
        self.gl_string = f"{self.unit_cd}-{self.division}-{self.organization}-{self.location}-{self.fund_type}-{self.business_line}-{self.account}"
        super(Accounting, self).save(*args, **kwargs)

    def __str__(self):
        return self.gl_string
    
    @property
    def _history_user(self):
        return self.modified_by

    @_history_user.setter
    def _history_user(self, value):
        self.modified_by = value

    class Meta:
        unique_together = ['department', 'offering_unit',]

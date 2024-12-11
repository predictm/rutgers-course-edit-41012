from django.db import models
from general.enum_helper import ContactRoles
from general.models import BaseModel
from django.contrib.auth import get_user_model
from simple_history.models import HistoricalRecords

User = get_user_model()


class Department(BaseModel):
    subj_cd = models.CharField(max_length=5)  
    subj_descr = models.CharField(max_length=50, null=True, blank=True) 
    address1 = models.CharField(max_length=255, null=True, blank=True)
    address2 = models.CharField(max_length=255, null=True, blank=True)
    campus = models.CharField(max_length=255, null=True, blank=True)
    phone = models.CharField(max_length=25, null=True, blank=True)
    fax = models.CharField(max_length=20, null=True, blank=True)
    url = models.URLField(null=True, blank=True)
    history = HistoricalRecords()

    @property
    def _history_user(self):
        return self.modified_by

    @_history_user.setter
    def _history_user(self, value):
        self.modified_by = value

    def __str__(self):
        return f"{self.subj_cd} - {self.subj_descr}"


class ContactRole(models.Model):
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.name


class Contact(BaseModel):
    dept = models.ForeignKey(Department, on_delete=models.CASCADE)
    role = models.ForeignKey(ContactRole, on_delete=models.CASCADE)
    is_active = models.BooleanField(default=True)
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    email = models.CharField(max_length=255)
    phone = models.CharField(max_length=255)
    title = models.CharField(max_length=255, null=True, blank=True)
    address1 = models.CharField(max_length=255, null=True, blank=True)
    address2 = models.CharField(max_length=255, null=True, blank=True)
    appointment_end_date = models.DateTimeField(null=True, blank=True)
    inactive_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name="contact_inactive_user", null=True, blank=True)
    date_inactive = models.DateTimeField(null=True, blank=True)
    comments = models.TextField(null=True, blank=True)
    history = HistoricalRecords()

    @property
    def _history_user(self):
        return self.modified_by

    @_history_user.setter
    def _history_user(self, value):
        self.modified_by = value

    def __str__(self):
        return f"{self.dept}-{self.role.name}"

    def save(self, *args, **kwargs):
        # Update the modified_by and modified_at fields of the related Department
        if self.dept:
            self.dept.modified_by = self.modified_by
            self.dept.save()
        super().save(*args, **kwargs)


class DepartmentUser(BaseModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="department_users") 
    dept = models.ForeignKey(Department, on_delete=models.CASCADE)
    unit = models.ForeignKey('course.OfferingUnit', on_delete=models.CASCADE)
    history = HistoricalRecords()

    @property
    def _history_user(self):
        return self.modified_by

    @_history_user.setter
    def _history_user(self, value):
        self.modified_by = value

    def __str__(self):
        return f"{self.user.net_id}-{self.dept.subj_descr}"

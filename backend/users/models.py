from django.conf import settings
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.urls import reverse
from django.utils.translation import ugettext_lazy as _
from general.enum_helper import UserType
from phonenumber_field.modelfields import PhoneNumberField

class User(AbstractUser):
    # WARNING!
    """
    Some officially supported features of Crowdbotics Dashboard depend on the initial
    state of this User model (Such as the creation of superusers using the CLI
    or password reset in the dashboard). Changing, extending, or modifying this model
    may lead to unexpected bugs and or behaviors in the automated flows provided
    by Crowdbotics. Change it at your own risk.


    This model represents the User instance of the system, login system and
    everything that relates with an `User` is represented by this model.
    """
    name = models.CharField(null=True,blank=True,max_length=255,)
    net_id = models.CharField(null=True, blank=True, max_length=255)
    user_type = models.CharField(choices=UserType.choices(), max_length=255, default=UserType.DEPARTMENT.value)
    first_name = models.CharField(_('first name'), max_length=150, blank=True)
    profile_image = models.ImageField(_('profile image'), null=True, blank=True, upload_to='profile_images/')
    phone_number = models.CharField(_('phone number'), blank=True, null=True, max_length=20)
    modified_at = models.DateTimeField(auto_now=True)
    modified_by = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True)

    def get_absolute_url(self):
        return reverse('users:detail', kwargs={'username': self.username})

    def __str__(self) -> str:
        return self.net_id if self.net_id else self.username

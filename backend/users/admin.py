from django.contrib import admin
from .models import User
from django.contrib.auth import admin as auth_admin
from django.contrib.auth import get_user_model

from users.forms import UserChangeForm, UserCreationForm

User = get_user_model()


@admin.register(User)
class UserAdmin(auth_admin.UserAdmin):

    form = UserChangeForm
    add_form = UserCreationForm
    fieldsets = (("User", {"fields": ("name", "net_id", "user_type", "profile_image", "phone_number", 'modified_by')}),) + auth_admin.UserAdmin.fieldsets
    list_display = ["id", "net_id", "username", "name", "is_superuser", "user_type", "is_staff"]
    search_fields = ["name"]

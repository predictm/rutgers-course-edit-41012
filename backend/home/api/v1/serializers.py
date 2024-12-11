import re
from django.contrib.auth import get_user_model
from django.http import HttpRequest
from django.utils.translation import ugettext_lazy as _
from allauth.account import app_settings as allauth_settings
from allauth.account.forms import ResetPasswordForm
from allauth.utils import email_address_exists, generate_unique_username
from allauth.account.adapter import get_adapter
from allauth.account.utils import setup_user_email
from rest_framework import serializers
from rest_auth.serializers import PasswordResetSerializer
from django.contrib.auth import authenticate
from department.models import DepartmentUser
from home.models import Announcement, AvailableToken, EmailTemplate

User = get_user_model()


class SignupSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'name', 'net_id')
        extra_kwargs = {
            'name': {'required': True},
            'net_id': {'required': True},
        }

    def validate_net_id(self, value):
        if User.objects.filter(net_id=value).exists():
            raise serializers.ValidationError('This net_id is already in use.')
        return value

    def create(self, validated_data):
        user = User(
            name=validated_data.get('name'),
            net_id=validated_data.get('net_id'),
            username=generate_unique_username([
                validated_data.get('name'),
                validated_data.get('net_id'),
                'user'
            ])
        )
        default_password = User.objects.make_random_password()
        user.set_password(default_password)
        user.save()
        request = self.context.get('request')
        setup_user_email(request, user, [])  # You might need to adjust this depending on your setup
        return user

    def save(self, request=None):
        """rest_auth passes request so we must override to accept it"""
        return super().save()


class UserDepartmentSerializer(serializers.ModelSerializer):
    subj_cd = serializers.CharField(source='dept.subj_cd', read_only=True)
    offering_unit_cd = serializers.CharField(source='unit.offering_unit_cd', read_only=True)
    subj_descr = serializers.CharField(source='dept.subj_descr', read_only=True)
    offering_unit_campus = serializers.CharField(source='unit.offering_unit_campus', read_only=True)
    offering_unit_level = serializers.CharField(source='unit.offering_unit_level', read_only=True)
    offering_unit_descr = serializers.CharField(source='unit.offering_unit_descr', read_only=True)

    class Meta:
        model = DepartmentUser
        exclude = ['user']


class UserSerializer(serializers.ModelSerializer):
    modified_by_name =serializers.CharField(source="modified_by.name", read_only=True)
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'profile_image', 'email', 'name', 'net_id', 'user_type', 'is_active', "phone_number", "date_joined", "modified_at", "modified_by", "modified_by_name"]


class UserGetSerializer(serializers.ModelSerializer):
    assigned_departments = UserDepartmentSerializer(many=True, source="department_users", read_only=True)
    modified_by_name =serializers.CharField(source="modified_by.name", read_only=True)
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'profile_image', 'last_name', 'net_id', 'user_type', 'is_active', 'assigned_departments', "phone_number", "date_joined", "modified_at", "modified_by", "modified_by_name"]


class UserCreateUpdateSerializer(serializers.ModelSerializer):
    departments = UserDepartmentSerializer(many=True, required=False)
    assigned_departments = UserDepartmentSerializer(many=True, source="department_users", read_only=True)
    modified_by_name =serializers.CharField(source="modified_by.name", read_only=True)
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'name', 'username', 'net_id', 'user_type', 'is_active', 'departments', 'assigned_departments', 'profile_image', "phone_number", "date_joined", "modified_at", "modified_by", "modified_by_name"]
        extra_kwargs = {'username': {'required': False}, 'name': {'required': False}, 'first_name': {'required': True}, 'last_name': {'required': True}, 'net_id': {'required': True}, 'email': {'required': True}, 'user_type': {'required': True}}

    def validate_email(self, value):
        # Check if the email is unique
        if User.objects.filter(email=value).exclude(id=self.instance.id if self.instance else None).exists():
            raise serializers.ValidationError('Email must be unique.')
        return value
    
    def validate_first_name(self, value):
        # Remove trailing spaces from the first name field
        return re.sub(r'\s+$', '', value)
    
    def validate_last_name(self, value):
        # Remove trailing spaces from the last name field
        return re.sub(r'\s+$', '', value)

    def validate_net_id(self, value):
        # Check if the net_id is unique
        if User.objects.filter(net_id=value).exclude(id=self.instance.id if self.instance else None).exists():
            raise serializers.ValidationError('net_id must be unique.')
        return value

    def create(self, validated_data):
        departments_data = validated_data.pop('departments', [])
        validated_data['username'] = validated_data.get('net_id')
        validated_data['name'] = validated_data['first_name'].capitalize()+" "+validated_data['last_name'].capitalize()
        user = super().create(validated_data)
        for data in departments_data:
            created, department_user = DepartmentUser.objects.get_or_create(user=user, **data)
        return user

    def update(self, instance, validated_data):
        departments_data = validated_data.pop('departments', [])
        validated_data['name'] = validated_data.get('first_name', instance.first_name).capitalize()+" "+validated_data.get('last_name', instance.last_name).capitalize()
        user = super().update(instance, validated_data)
        if departments_data:
            for data in departments_data:
                DepartmentUser.objects.update_or_create(user=user, dept=data['dept'], defaults={'unit': data['unit']})
            existing_department_ids = [data['dept'] for data in departments_data]
            DepartmentUser.objects.filter(user=user).exclude(dept__in=existing_department_ids).delete()
        return instance


class PasswordSerializer(PasswordResetSerializer):
    """Custom serializer for rest_auth to solve reset password error"""
    password_reset_form_class = ResetPasswordForm

class AuthTokenSerializer(serializers.Serializer):
    net_id = serializers.CharField()
    
    def validate(self, data):
        net_id = data.get('net_id')
        if net_id:
            user = authenticate(net_id=net_id)  # Implement your authentication logic here
            if not user:
                raise serializers.ValidationError('Invalid credentials')
            data['user'] = user
        else:
            raise serializers.ValidationError('net_id is required')
        return data


class AvailableTokenSerializer(serializers.ModelSerializer):
    class Meta:
        model = AvailableToken
        fields = '__all__'


class EmailTemplateSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = EmailTemplate
        fields = '__all__'


class AnnouncementSerializer(serializers.ModelSerializer):
    """
    Serializer for the Announcement model.

    This serializer is used to convert Announcement model instances to JSON data and vice versa.
    It specifies the fields to be included in the serialization.

    Attributes:
        Meta: A nested class that defines the model and fields to be serialized.
    """
    modified_by = UserSerializer(read_only=True)

    class Meta:
        model = Announcement
        fields = '__all__'

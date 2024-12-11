from rest_framework import serializers
from accounting.models import Accounting
from course.models import OfferingUnit
from department.models import Contact, ContactRole, Department
from home.api.v1.serializers import UserSerializer


class ContactRoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactRole
        fields = '__all__'


class ContactSerializer(serializers.ModelSerializer):
    modified_by = UserSerializer(read_only=True)
    inactive_by = UserSerializer(read_only=True)
    contact_role = ContactRoleSerializer(read_only=True, source='role')

    class Meta:
        model = Contact
        fields = '__all__'
        extra_kwargs = {'title': {'required': True}}


class DepartmentSerializer(serializers.ModelSerializer):
    contacts = ContactSerializer(many=True, read_only=True, source='contact_set')
    modified_by = UserSerializer(read_only=True)

    class Meta:
        model = Department
        fields = '__all__'


class OfferingUnitSerializer(serializers.ModelSerializer):
    class Meta:
        model = OfferingUnit
        fields = '__all__'


class AccountingSerializer(serializers.ModelSerializer):
    department_info = DepartmentSerializer(read_only=True, source='department')
    offering_unit_info = OfferingUnitSerializer(read_only=True, source='offering_unit')
    modified_by = UserSerializer(read_only=True)

    class Meta:
        model = Accounting
        fields = '__all__'

from rest_framework import serializers
from course.api.v1.serializers import OfferingUnitSerializer
from course.models import CourseSection
from department.models import Department, Contact, DepartmentUser, ContactRole
from home.api.v1.serializers import UserSerializer
from django.contrib.auth import get_user_model
from allauth.utils import generate_unique_username

User = get_user_model()


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

    def create(self, validated_data):
        subj_cd = validated_data.get('subj_cd')
        existing_department = Department.objects.filter(subj_cd=subj_cd).first()
        if existing_department:
            return existing_department
        department = Department.objects.create(**validated_data)
        return department


class UserDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'name', 'net_id', 'email', 'user_type', 'is_active']


class DepartmentUserSerializer(serializers.ModelSerializer):
    unit = OfferingUnitSerializer(read_only=True)
    dept = DepartmentSerializer(read_only=True)
    user_data = UserDataSerializer(read_only=True, source="user")
    
    class Meta:
        model = DepartmentUser
        fields = '__all__'


class DepartmentUserAddSerializer(serializers.ModelSerializer):
    user_data = UserDataSerializer(source="user")

    class Meta:
        model = DepartmentUser
        fields = '__all__'
        extra_kwargs = {'user': {'required': False}}

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        net_id = user_data['net_id']
        email = user_data['email']
        name = user_data['name']
        if User.objects.filter(net_id=net_id).exists():
            raise serializers.ValidationError({"net_id": "User with this net_id already exists"})
        user, created = User.objects.get_or_create(net_id=net_id, name=name, email=email)
        user.user_type = user_data.get('user_type', user.user_type)
        user.username=generate_unique_username([
                validated_data.get('name'),
                validated_data.get('net_id'),
                'user'
            ])
        user.is_active = user_data.get('is_active', True)
        user.save()
        department_user, created = DepartmentUser.objects.get_or_create(user=user, **validated_data)
        return department_user

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', None)
        if user_data:
            user_id = user_data.get("id", instance.user.id)
            try:
                user = User.objects.get(id=user_id)
            except User.DoesNotExist:
                raise serializers.ValidationError({"user": "User does not exist"})
            if user_data.get("net_id") and user.net_id != user_data["net_id"]:
                if User.objects.filter(net_id=user_data["net_id"]).exclude(id=user_id).exists():
                    raise serializers.ValidationError({"net_id": "User with this net_id already exists"})
            for attr in ['net_id', 'name', 'email', 'user_type', 'is_active']:
                setattr(user, attr, user_data.get(attr, getattr(user, attr)))
            user.save()
            instance.user = user

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance


class DepartmentCourseSectionSerializer(serializers.Serializer):
    department = DepartmentSerializer()
    offering_unit = OfferingUnitSerializer()

    class Meta:
        fields = ['department', 'offering_unit']
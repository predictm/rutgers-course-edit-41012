from rest_framework import serializers
from appointment.api.v1.serializers import AppointmentSerializer, InstructorSerializer
from contract.models import Contract, ContractTemplate
from general.enum_helper import ContractStatus
from django.utils import timezone

from home.api.v1.serializers import UserSerializer

class ContractTemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContractTemplate
        fields = '__all__'
        read_only_fields = ('modified_by',)

    def update(self, instance, validated_data):
        # Deactivate the current instance
        instance.is_active = False
        instance.save()
        # Create a new instance with the updated data and set it as active
        validated_data['is_active'] = True
        new_instance = ContractTemplate.objects.create(**validated_data)

        return new_instance


class ContractSerializer(serializers.ModelSerializer):
    contract_template = ContractTemplateSerializer(read_only=True)
    instructor = InstructorSerializer(read_only=True)
    appointments = AppointmentSerializer(read_only=True, many=True)
    is_revised_contract = serializers.SerializerMethodField()
    revised_contract_count = serializers.SerializerMethodField()
    contract_hierarchy = serializers.SerializerMethodField()
    modified_by = UserSerializer(read_only=True)
    send_for_signature_by = UserSerializer(read_only=True)
    hcm_entered_by = UserSerializer(read_only=True)
    
    class Meta:
        model = Contract
        fields = '__all__'
        read_only_fields = ('modified_by', 'contract_template',)

    def update(self, instance, validated_data):
        if instance.status == ContractStatus.HCM_READY.value and validated_data.get('status') == ContractStatus.HCM_ENTER.value:
            validated_data['date_hcm_entered'] = timezone.now()
            validated_data['hcm_entered_by'] = self.context['request'].user
        instance = super().update(instance, validated_data)
        return instance
    
    def get_is_revised_contract(self, obj):
        return obj.previous_contract is not None

    def get_revised_contract_count(self, obj):
        count = 0
        previous_contract = obj.previous_contract

        while previous_contract:
            count += 1
            previous_contract = previous_contract.previous_contract

        return count

    def get_contract_hierarchy(self, obj):
        contract_hierarchy = []
        current_contract = obj

        while current_contract:
            contract_hierarchy.insert(0, {
                'id': current_contract.id,
                'is_revised_contract': current_contract.previous_contract is not None,
                'revised_contract_count': self.get_revised_contract_count(current_contract),
                'date_send_for_signature': current_contract.date_send_for_signature,
                'send_for_signature_by': current_contract.send_for_signature_by.get_full_name() if current_contract.send_for_signature_by else None,
                'previous_contract': current_contract.previous_contract.id if current_contract.previous_contract else None,
                'signed_document' : current_contract.signed_document.url if current_contract.signed_document else None,
            })
            current_contract = current_contract.previous_contract

        return contract_hierarchy


class DocuSignRequestSerializer(serializers.Serializer):
    html_document = serializers.CharField()
    type = serializers.ChoiceField(choices=['embedded', 'email'])
    contract_id = serializers.PrimaryKeyRelatedField(queryset=Contract.objects.all())


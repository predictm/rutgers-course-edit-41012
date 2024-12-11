from django.contrib import admin

from contract.models import Contract, ContractTemplate, DocusignKey

# Register your models here.

class ContractTemplateAdmin(admin.ModelAdmin):
    list_display = ('id', 'template_type', 'is_active')
    list_filter = ('template_type', 'is_active')
    search_fields = ('template_type', 'content')
    ordering = ('template_type', '-is_active')
    fieldsets = (
        (None, {
            'fields': ('template_type', 'content', 'default_content', 'is_active')
        }),
        ('Audit', {
            'fields': ('modified_by', 'created_at', 'modified_at')
        }),
    )
    readonly_fields = ('modified_by', 'created_at', 'modified_at')


class ContractAdmin(admin.ModelAdmin):
    list_display = ['id', 'instructor', 'status', 'is_signed', 'previous_contract', 'is_active', 'created_at']
    list_filter = ['status']
    search_fields = ['instructor__first_name', 'instructor__last_name']


class DocusignKeyAdmin(admin.ModelAdmin):
    list_display = ['id', 'private_key']
    search_fields = ['private_key']
    ordering = ['-created_at']


admin.site.register(DocusignKey, DocusignKeyAdmin)
admin.site.register(ContractTemplate, ContractTemplateAdmin)
admin.site.register(Contract, ContractAdmin)


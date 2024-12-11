from django.contrib import admin
from .models import ContactRole, Department, Contact, DepartmentUser
from simple_history.admin import SimpleHistoryAdmin

class DepartmentAdmin(SimpleHistoryAdmin):
    list_display = ('subj_cd', 'subj_descr', 'campus', 'phone', 'fax')
    list_filter = ('campus',)
    search_fields = ('subj_cd', 'subj_descr', 'campus', 'phone', 'fax')
    
class ContactAdmin(SimpleHistoryAdmin):
    list_display = ('dept', 'role', 'is_active', 'first_name', 'last_name', 'email', 'phone')
    list_filter = ('dept', 'role__name', 'is_active')
    search_fields = ('dept__subj_cd', 'dept__subj_descr', 'first_name', 'last_name', 'email', 'phone', 'role__name')
    
class DepartmentUserAdmin(SimpleHistoryAdmin):
    list_display = ('user', 'dept', 'unit')
    list_filter = ('dept',)
    search_fields = ('user__username', 'dept__subj_cd', 'dept__subj_descr')


class ContactRoleAdmin(admin.ModelAdmin):
    list_display = ('id', 'name',)
    search_fields = ('name',)


admin.site.register(ContactRole, ContactRoleAdmin)
admin.site.register(Department, DepartmentAdmin)
admin.site.register(Contact, ContactAdmin)
admin.site.register(DepartmentUser, DepartmentUserAdmin)

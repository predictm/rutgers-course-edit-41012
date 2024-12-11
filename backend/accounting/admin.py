from django.contrib import admin
from simple_history.admin import SimpleHistoryAdmin
from accounting.models import Accounting
# Register your models here.


class AccountingAdmin(SimpleHistoryAdmin):
    list_display = ('gl_string', 'offering_unit', 'department', 'unit_cd', 'division', 'organization', 'location', 'fund_type', 'business_line', 'account')
    list_filter = ('offering_unit', 'department')
    search_fields = ('gl_string',)
    list_select_related = True
    readonly_fields = ('gl_string',)

admin.site.register(Accounting, AccountingAdmin)
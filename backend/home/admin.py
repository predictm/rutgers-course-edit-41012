from django.contrib import admin
from simple_history.admin import SimpleHistoryAdmin
from home.models import Announcement, AvailableToken, EmailTemplate
# Register your models here.

class AvailableTokenAdmin(SimpleHistoryAdmin):
    list_display = ('token', 'content_type', 'field_name')
    list_filter = ('content_type',)
    search_fields = ('token', 'field_name')

admin.site.register(AvailableToken, AvailableTokenAdmin)


class EmailTemplateAdmin(SimpleHistoryAdmin):
    list_display = ('email_type', 'subject', 'is_active', 'to')
    list_filter = ('is_active',)
    search_fields = ('email_type', 'subject', 'to')

admin.site.register(EmailTemplate, EmailTemplateAdmin)


@admin.register(Announcement)
class AnnouncementAdmin(SimpleHistoryAdmin):
    list_display = ('title', 'type', 'start_date', 'end_date', 'is_active')
    list_filter = ('type', 'is_active')
    search_fields = ('title', 'message')

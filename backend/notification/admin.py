from django.contrib import admin
from notification.models import Notification


class NotificationAdmin(admin.ModelAdmin):
    list_display = ('user', 'title', 'notification_type', 'is_read', 'created_at', 'modified_at')
    list_filter = ('user', 'notification_type', 'is_read', 'created_at')
    search_fields = ('user__net_id', 'title', 'notification_type', 'created_at')
    readonly_fields = ('created_at', 'modified_at')
    fieldsets = (
        ('Notification Information', {
            'fields': ('user', 'title', 'notification_type', 'message', 'is_read')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'modified_at'),
            'classes': ('collapse',),
        }),
    )

    def get_readonly_fields(self, request, obj=None):
        if obj:  # editing an existing object
            return self.readonly_fields + ('user',)
        return self.readonly_fields

admin.site.register(Notification, NotificationAdmin)

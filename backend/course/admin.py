from django.contrib import admin
from .models import CourseFeeType, CoursePrereq, CourseSectionComment, CourseSectionDates, CourseStatusType, OfferingUnit, CourseSection, OfferingExpTtl, SctnSubtitle, CourseMtg, Semester, SessionDate, Tuition
from django.db.models import Sum
from django.db.models.functions import Coalesce
from django.utils.translation import gettext as _
from simple_history.admin import SimpleHistoryAdmin


class OfferingUnitAdmin(SimpleHistoryAdmin):
    list_display = ('offering_unit_cd', 'offering_unit_campus', 'offering_unit_level', 'offering_unit_descr', 'home_campus')
    search_fields = ('offering_unit_cd', 'offering_unit_descr')
    list_filter = ('offering_unit_campus', 'offering_unit_level', 'home_campus')


class CourseSectionAdmin(SimpleHistoryAdmin):
    list_display = ('id', 'year', 'term', 'offering_unit', 'offering_campus', 'course_no', 'section_no', 'department', 'reg_index_no', 'course_title', 'status_cd')
    list_filter = ('year', 'term', 'status_cd')
    search_fields = ('reg_index_no', 'course_no', 'course_title', 'offering_unit__offering_unit_cd', 'department__subj_cd')
    ordering = ('offering_unit__offering_unit_cd', 'department__subj_cd', 'course_no', 'section_no')

    @staticmethod
    def offering_campus(obj):
        return obj.offering_unit.offering_unit_campus

    offering_campus.short_description = 'Offering Unit Campus'


class OfferingExpTtlAdmin(SimpleHistoryAdmin):
    list_display = ('year', 'term', 'course_section', 'offering_unit_cd', 'subj_cd', 'course_no', 'supplment_cd', 'expand_course_title_descr')
    list_filter = ('year', 'term', 'offering_unit_cd', 'subj_cd', 'course_no', 'supplment_cd')
    search_fields = ('expand_course_title_descr', 'course_section__reg_index_no')


class SctnSubtitleAdmin(SimpleHistoryAdmin):
    list_display = ('year', 'term', 'course_section', 'offering_unit_cd', 'subj_cd', 'course_no', 'section_no', 'supplment_cd', 'subtitle_descr')
    list_filter = ('year', 'term', 'offering_unit_cd', 'subj_cd', 'course_no', 'section_no', 'supplment_cd')
    search_fields = ('subtitle_descr', 'course_section__reg_index_no')


class CourseMtgAdmin(SimpleHistoryAdmin):
    list_display = ('year', 'term', 'course_section', 'reg_index_no', 'mtg_day', 'start_time', 'end_time', 'bldg_cd', 'room_no', 'meeting_mode_cd')
    list_filter = ('year', 'term', 'mtg_day', 'meeting_mode_cd')
    search_fields = ('course_section__reg_index_no', 'bldg_cd', 'room_no', 'campus_name', 'campus_abbrev')


class CourseStatusTypeAdmin(admin.ModelAdmin):
    list_display = ('name',)


class CourseFeeTypeAdmin(admin.ModelAdmin):
    list_display = ('name',)


class CourseSectionDatesAdmin(SimpleHistoryAdmin):
    list_display = ('course_section', 'start_date', 'end_date', 'course_status', 'is_highschool_course', 'course_fee_type', 'course_fee')
    list_filter = ('course_status', 'is_highschool_course', 'course_fee_type')
    search_fields = ('course_section__course_no', 'course_section__course_title')


class CourseSectionCommentAdmin(SimpleHistoryAdmin):
    list_display = ('id', 'user', 'course_section', 'text', 'hide_from_unit')
    list_filter = ('hide_from_unit',)
    search_fields = ('user__username', 'course_section__title', 'text')
    actions = ['mark_as_hidden']

    def mark_as_hidden(self, request, queryset):
        """
        Custom admin action to mark selected comments as hidden.
        """
        queryset.update(hide_from_unit=True)
        self.message_user(request, f'Selected comments have been marked as hidden.')

    mark_as_hidden.short_description = 'Mark selected comments as hidden'


class CoursePrereqAdmin(SimpleHistoryAdmin):
    list_display = ('year', 'term', 'subj_cd', 'course_no', 'boolean_pattern_cd', 'course_suppl_cd')
    search_fields = ('year', 'term', 'subj_cd', 'course_no', 'boolean_pattern_cd', 'course_suppl_cd')

    fieldsets = (
        ('Course Information', {
            'fields': ('course_section', 'year', 'term', 'offering_unit_cd', 'subj_cd', 'course_no')
        }),
        ('Prerequisites', {
            'fields': (
                ('prereq1_unit', 'prereq1_subj', 'prereq1_course', 'prereq1_boolean'),
                ('prereq2_unit', 'prereq2_subj', 'prereq2_course', 'prereq2_boolean'),
                ('prereq3_unit', 'prereq3_subj', 'prereq3_course', 'prereq3_boolean'),
                ('prereq4_unit', 'prereq4_subj', 'prereq4_course', 'prereq4_boolean'),
                ('prereq5_unit', 'prereq5_subj', 'prereq5_course', 'prereq5_boolean'),
                ('prereq6_unit', 'prereq6_subj', 'prereq6_course', 'prereq6_boolean'),
                ('prereq7_unit', 'prereq7_subj', 'prereq7_course', 'prereq7_boolean'),
                ('prereq8_unit', 'prereq8_subj', 'prereq8_course', 'prereq8_boolean'),
                ('prereq9_unit', 'prereq9_subj', 'prereq9_course', 'prereq9_boolean'),
                ('prereq10_unit', 'prereq10_subj', 'prereq10_course', 'prereq10_boolean'),
                ('prereq11_unit', 'prereq11_subj', 'prereq11_course', 'prereq11_boolean'),
                ('prereq12_unit', 'prereq12_subj', 'prereq12_course', 'prereq12_boolean'),
                ('prereq13_unit', 'prereq13_subj', 'prereq13_course', 'prereq13_boolean'),
                ('prereq14_unit', 'prereq14_subj', 'prereq14_course', 'prereq14_boolean'),
                ('prereq15_unit', 'prereq15_subj', 'prereq15_course', 'prereq15_boolean'),
                ('prereq16_unit', 'prereq16_subj', 'prereq16_course', 'prereq16_boolean'),
                ('prereq17_unit', 'prereq17_subj', 'prereq17_course', 'prereq17_boolean'),
                ('prereq18_unit', 'prereq18_subj', 'prereq18_course', 'prereq18_boolean'),
                ('prereq19_unit', 'prereq19_subj', 'prereq19_course', 'prereq19_boolean'),
                ('prereq20_unit', 'prereq20_subj', 'prereq20_course', 'prereq20_boolean'),
                ('prereq21_unit', 'prereq21_subj', 'prereq21_course', 'prereq21_boolean'),
                ('prereq22_unit', 'prereq22_subj', 'prereq22_course', 'prereq22_boolean'),
                ('prereq23_unit', 'prereq23_subj', 'prereq23_course', 'prereq23_boolean'),
                ('prereq24_unit', 'prereq24_subj', 'prereq24_course', 'prereq24_boolean'),
            ),
        }),
        ('Patterns and Codes', {
            'fields': ('boolean_pattern_cd', 'course_suppl_cd'),
        }),
    )


class TuitionAdmin(SimpleHistoryAdmin):
    list_display = ('offering_unit', 'year', 'term', 'tuition_fees')
    list_filter = ('offering_unit__offering_unit_cd', 'year', 'term')
    search_fields = ('offering_unit__offering_unit_descr', 'year', 'term')
    list_per_page = 20


class SessionDateAdmin(admin.ModelAdmin):
    list_display = ('year', 'term', 'session_id_cd', 'course_session_desc', 'start_date', 'end_date')
    list_filter = ('year', 'term')
    search_fields = ('course_session_desc',)


class SemesterAdmin(admin.ModelAdmin):
    list_display = ('year', 'term', 'is_current_semester')
    list_filter = ('year', 'term')
    search_fields = ('year', 'term')


admin.site.register(Semester, SemesterAdmin)
admin.site.register(SessionDate, SessionDateAdmin)
admin.site.register(Tuition, TuitionAdmin)
admin.site.register(CoursePrereq, CoursePrereqAdmin)
admin.site.register(CourseSectionComment, CourseSectionCommentAdmin)
admin.site.register(CourseStatusType, CourseStatusTypeAdmin)
admin.site.register(CourseFeeType, CourseFeeTypeAdmin)
admin.site.register(CourseSectionDates, CourseSectionDatesAdmin)
admin.site.register(OfferingUnit, OfferingUnitAdmin)
admin.site.register(CourseSection, CourseSectionAdmin)
admin.site.register(OfferingExpTtl, OfferingExpTtlAdmin)
admin.site.register(SctnSubtitle, SctnSubtitleAdmin)
admin.site.register(CourseMtg, CourseMtgAdmin)

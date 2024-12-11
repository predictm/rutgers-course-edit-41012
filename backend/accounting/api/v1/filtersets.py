import django_filters
from accounting.models import Accounting


class AccountingFilter(django_filters.FilterSet):
    gl_string = django_filters.CharFilter(lookup_expr='icontains')
    offering_unit__offering_unit_cd = django_filters.CharFilter(lookup_expr='exact')
    department__subj_cd = django_filters.CharFilter(lookup_expr='exact')

    class Meta:
        model = Accounting
        fields = []
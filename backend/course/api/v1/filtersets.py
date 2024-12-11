from django_filters import rest_framework as filters
from course.models import Tuition


class TuitionFilter(filters.FilterSet):
    class Meta:
        model = Tuition
        fields = {
            'offering_unit__offering_unit_cd': ['exact'],
            'year': ['exact'],
            'term': ['exact'],
        }

# tasks.py
from celery import shared_task
from django.db import transaction
from course.api.v1.serializers import CourseMtgSerializer, OfferingExpTtlSerializer, OfferingUnitSerializer, SessionDateSerializer, TuitionSerializer, TuitonCreateSerializer
from course.models import CourseMtg, CourseSection, OfferingExpTtl, OfferingUnit, SctnSubtitle, SessionDate, Tuition
from department.api.v1.serializers import DepartmentSerializer
from department.models import Department
import json



@transaction.atomic
def add_offering_exp_ttl_sample_data():
    instances_to_create = []

    # Read the JSON file
    with open('general/sample_data/offrng_exp_ttl.csv.json') as file:
        data = json.load(file)

    if isinstance(data, list):
        # If data is a list, create multiple instances
        for item in data:
            subj_cd = item['subj_cd']
            offering_unit_cd = item['offering_unit_cd']
            offering_unit_exp_ttl = OfferingExpTtl.objects.filter(
                year=item['year'],
                term=item['term'],
                subj_cd=subj_cd,
                course_no=item['course_no'],
                supplment_cd=item['supplment_cd'],
            )
            if offering_unit_exp_ttl.exists():
                continue
            course_section = CourseSection.objects.filter(
                subj_cd=subj_cd,
                offering_unit_cd = item['offering_unit_cd'],
                course_no=item['course_no'],
                course_suppl_cd=item['supplment_cd'],
                year=str(item['year']),
                term=item['term']
            ).first()
            offering_unit = OfferingUnit.objects.filter(offering_unit_cd=offering_unit_cd).first()

            if course_section and offering_unit:
                item['course_section'] = course_section
                instance = OfferingExpTtl.objects.create(**item)

        return {
            'status': 'success',
            'response_message': f'{len(instances_to_create)} instances created successfully',
            'created_instance_ids': [instance.id for instance in instances_to_create],
        }
    else:
        # If data is not a list, create a single instance
        serializer = OfferingExpTtlSerializer(data=data)

        if serializer.is_valid():
            instance = serializer.save()
            return {
                'status': 'success',
                'response_message': 'Instance created successfully',
                'data': serializer.data,
            }
        return serializer.errors



@transaction.atomic
def add_course_sections_sample_data():
    
    # Read the JSON file
    with open('general/sample_data/course_section.csv.json') as file:
        data = json.load(file)
    
    instances_to_create = []
    for item in data:
        subj_cd = item['subj_cd']
        offering_unit_cd = item['offering_unit_cd']
        year = item['year']
        term = item['term']
        session_id_cd = item['session_id_cd']

        department = Department.objects.filter(subj_cd=subj_cd).first()
        if not department:
            continue
        offering_unit = OfferingUnit.objects.filter(offering_unit_cd=offering_unit_cd).first()
        if not offering_unit:
            continue
        session_date = SessionDate.objects.filter(term=term, year=year, session_id_cd=session_id_cd).first()
        item['session_date'] = session_date
        item['department'] = department
        item['offering_unit'] = offering_unit

        # Check if CourseSection with the same data already exists
        existing_course_section = CourseSection.objects.filter(
            subj_cd=subj_cd,
            offering_unit_cd=offering_unit_cd,
            year=year,
            term=term,
            session_id_cd=session_id_cd,
            course_no=item['course_no'],
            section_no=item['section_no'],
            course_suppl_cd=item['course_suppl_cd'],

        ).exists()
        if existing_course_section:
            continue
        instance = CourseSection(**item)
        instances_to_create.append(instance)

    CourseSection.objects.bulk_create(instances_to_create)
    created_instance_ids = [instance.id for instance in instances_to_create]
    return {
        'response_message': f'{len(created_instance_ids)} instances created successfully',
        'created_instance_ids': created_instance_ids,
    }


@transaction.atomic
def add_sctn_subtitle_sample_data():

    # Read the JSON file
    with open('general/sample_data/sctn_subtitle.csv.json') as file:
        data = json.load(file)
    
    instances_to_create = []
    for item in data:
        subj_cd = item['subj_cd']
        offering_unit_cd = item['offering_unit_cd']
        course_section = CourseSection.objects.filter(
            year=item['year'],
            term=item['term'],
            offering_unit_cd=item['offering_unit_cd'],
            subj_cd=subj_cd,
            course_no=item['course_no'],
            section_no=item['section_no'],
            course_suppl_cd=item['supplment_cd']
        ).first()
        if not course_section:
            continue

        # Find the OfferingUnit if it exists, otherwise skip creating the SctnSubtitle
        offering_unit = OfferingUnit.objects.filter(offering_unit_cd=offering_unit_cd).first()
        if not offering_unit:
            continue

        item['course_section'] = course_section
        instances_to_create.append(SctnSubtitle(**item))

    created_instances = SctnSubtitle.objects.bulk_create(instances_to_create)
    return f'{len(created_instances)} instances created successfully'



@transaction.atomic
def add_offering_unit_sample_data():
    with open('general/sample_data/offering_unit.csv.json', 'r') as file:
        data = json.load(file)

    if isinstance(data, list):
        serializer = OfferingUnitSerializer(data=data, many=True)
    else:
        serializer = OfferingUnitSerializer(data=data)

    if serializer.is_valid():
        units_to_create = []

        for unit_data in serializer.validated_data:
            # Check if an instance with the same unique fields already exists
            instance = OfferingUnit.objects.filter(
                offering_unit_cd=unit_data['offering_unit_cd'],
                offering_unit_campus=unit_data['offering_unit_campus'],
                offering_unit_level=unit_data['offering_unit_level'],
            ).first()

            if not instance:
                units_to_create.append(unit_data)

        if units_to_create:
            created_units = OfferingUnit.objects.bulk_create([OfferingUnit(**data) for data in units_to_create])
            return {
                'status': 'success',
                'response_response_message': f'{len(created_units)} units created successfully',
                'created_unit_ids': [unit.id for unit in created_units],
            }
        else:
            return {"detail": "No new units created. Existing units skipped."}

    return serializer.errors


@transaction.atomic
def add_course_mtg_sample_data():
    with open('general/sample_data/course_mtg.csv.json', 'r') as file:
        data = json.load(file)

    if isinstance(data, list):
        serializer = CourseMtgSerializer(data=data, many=True)
    else:
        serializer = CourseMtgSerializer(data=data)

    if serializer.is_valid():
        instances = []

        for item in serializer.validated_data:
            course_section = CourseSection.objects.filter(
                reg_index_no=item['reg_index_no'],
                term=item['term'],
                year=item['year'],
            ).first()

            if not course_section:
                continue

            instance = CourseMtg(course_section=course_section, **item)
            instances.append(instance)

        CourseMtg.objects.bulk_create(instances)
        created_instance_ids = [instance.id for instance in instances]

        return {
            'status': 'success',
            'response_message': f'{len(created_instance_ids)} instances created successfully',
            'created_instance_ids': created_instance_ids,
        }

    return serializer.errors



@transaction.atomic
def add_or_update_tuition_sample_data():
    with open('general/sample_data/tuition.csv.json', 'r') as file:
        data = json.load(file)

    if isinstance(data, list):
        serializer = TuitonCreateSerializer(data=data, many=True)
    else:
        serializer = TuitionSerializer(data=data)

    if serializer.is_valid():
        created_instances = []

        for item in serializer.validated_data:
            offering_unit = OfferingUnit.objects.filter(offering_unit_cd=item['offering_unit_cd']).first()

            if offering_unit:
                item['offering_unit'] = offering_unit
                item.pop('offering_unit_cd')

                instance = Tuition.objects.filter(offering_unit=offering_unit, year=item['year'], term=item['term']).first()

                if instance:
                    instance.tuition_fees = item['tuition_fees']
                    instance.save()
                else:
                    instance = Tuition.objects.create(offering_unit=offering_unit, year=item['year'], term=item['term'], tuition_fees=item['tuition_fees'])

                created_instances.append(instance)

        return {
            'response_message': f'{len(created_instances)} instances created/updated successfully',
            'created_instance_ids': [instance.id for instance in created_instances],
        }

    return serializer.errors



@transaction.atomic
def add_or_update_session_date_sample_data():
    with open('general/sample_data/session_date.csv.json', 'r') as file:
        data = json.load(file)

    if isinstance(data, list):
        serializer = SessionDateSerializer(data=data, many=True)
    else:
        serializer = SessionDateSerializer(data=data)

    if serializer.is_valid():
        created_instances = []

        for item in serializer.validated_data:
            instance, _ = SessionDate.objects.get_or_create(term=item['term'], year=item['year'], session_id_cd=item['session_id_cd'])
            instance.start_date = item['start_date']
            instance.end_date = item['end_date']
            instance.course_session_desc = item['course_session_desc']
            instance.save()
            created_instances.append(instance)

        return {
            'response_message': f'{len(created_instances)} instances created/updated successfully',
            'created_instance_ids': [instance.id for instance in created_instances],
        }

    return serializer.errors


@transaction.atomic
def add_or_update_department_sample_data():
    with open('general/sample_data/course_major.csv.json', 'r') as file:
        data = json.load(file)

    if isinstance(data, list):
        serializer = DepartmentSerializer(data=data, many=True)
    else:
        serializer = DepartmentSerializer(data=data)

    if serializer.is_valid():
        departments_to_create = []

        for department_data in serializer.validated_data:
            subj_cd = department_data.get('subj_cd')
            existing_department = Department.objects.filter(subj_cd=subj_cd).first()
            if not existing_department:
                departments_to_create.append(Department(**department_data))

        if departments_to_create:
            Department.objects.bulk_create(departments_to_create)
            return {
                'response_message': f'{len(departments_to_create)} departments created successfully',
                'created_department_ids': [department.id for department in departments_to_create],
            }

        return {'detail': 'No new departments created. Existing departments skipped.'}

    return serializer.errors

@shared_task
def add_sample_data():
    results = {}
    errors = {}
    functions = [
        ('add_or_update_department_sample_data', add_or_update_department_sample_data),
        ('add_offering_unit_sample_data', add_offering_unit_sample_data),
        ('add_course_sections_sample_data', add_course_sections_sample_data),
        ('add_offering_exp_ttl_sample_data', add_offering_exp_ttl_sample_data),
        ('add_sctn_subtitle_sample_data', add_sctn_subtitle_sample_data),
        ('add_or_update_tuition_sample_data', add_or_update_tuition_sample_data),
        ('add_or_update_session_date_sample_data', add_or_update_session_date_sample_data),
        ('add_course_mtg_sample_data', add_course_mtg_sample_data),
    ]

    # Call each function and capture the results or errors
    for function_name, function in functions:
        try:
            results[function_name] = function()
        except Exception as e:
            errors[function_name] = str(e)

    return {'results': results, 'errors': errors}

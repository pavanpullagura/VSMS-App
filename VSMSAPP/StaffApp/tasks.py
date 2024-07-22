from celery import shared_task
from django.utils import timezone
from .models import StudentLoginDetails, StudentAttendance

@shared_task
def mark_absent():
    today = timezone.now().date()
    for student in StudentLoginDetails.objects.all():
        attendance, created = StudentAttendance.objects.get_or_create(
            student=student,
            date=today,
            defaults={'status': 'ABSENT'}
        )
        if not created and attendance.status == '':
            attendance.status = 'ABSENT'
            attendance.save()

from django.core.management.base import BaseCommand
from django.utils import timezone
from StaffApp.models import StudentAttendance, StudentLoginDetails

class Command(BaseCommand):
    help = 'Mark students absent if not marked present'

    def handle(self, *args, **kwargs):
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
        self.stdout.write(self.style.SUCCESS('Successfully marked absentees'))

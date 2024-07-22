from django import forms
from .models import Courses,Batches,StudentLoginDetails,StudentMockInterviews,StudentAttendance,StudentWeeklyTests

class RegisterStudentForm(forms.ModelForm):
    class Meta:
        model = StudentLoginDetails
        fields='__all__'

class AddCourseForm(forms.ModelForm):
    class Meta:
        model=Courses
        fields='__all__'

class AddBatchForm(forms.ModelForm):
    class Meta:
        model=Batches
        fields='__all__'

class StudentAttendanceForm(forms.Form):
    status = forms.CharField(max_length=20)

class StudentWeeklyTestsForm(forms.ModelForm):
    class Meta:
        model=StudentWeeklyTests
        fields=['test_date','obtained_marks','total_marks']
class StudentMockPerformanceForm(forms.ModelForm):
    class Meta:
        model=StudentMockInterviews
        fields='__all__'
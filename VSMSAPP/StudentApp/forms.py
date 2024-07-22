from django import forms
from StaffApp import models

class GetStudentRegisterForm(forms.ModelForm):
    class Meta:
        model = models.UnconfirmedStudents
        fields = '__all__'
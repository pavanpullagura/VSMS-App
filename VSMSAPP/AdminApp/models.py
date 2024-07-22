from django.db import models
from StaffApp.models import Courses
from django.contrib.auth.models import User

# Create your models here.


class AdminDetails(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100, null=True)
    username = models.CharField(max_length=50,unique=True)
    email= models.EmailField(unique=True)
    contact_num = models.BigIntegerField(unique=True)
    joining_date = models.DateField()
    gender = models.CharField(max_length=10, choices=[('male', 'Male'), ('female', 'Female'), ('other', 'Other')], null=True, blank=True)  # New field
    image = models.ImageField(null=True, upload_to='images/')
    otp = models.CharField(max_length=6, null=True, blank=True)  # For password reset OTP
    otp_expiry = models.DateTimeField(null=True, blank=True)  # OTP expiry time

    def __str__(self):
        return self.username

class StaffDepartments(models.Model):
    '''this table is for staff positions in the institute'''
    department_id = models.IntegerField(primary_key=True)
    departmanet_name = models.CharField(max_length=50)
    
    def __str__(self):
        return self.departmanet_name

class StaffDetails(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100,null=True)
    username = models.CharField(max_length=50, unique=True)
    email = models.EmailField(unique=True)
    contact_num = models.BigIntegerField(unique=True)
    joining_date = models.DateField()
    qualification = models.CharField(max_length=50)
    address = models.CharField(max_length=500)
    department = models.ForeignKey(StaffDepartments, null=True, on_delete=models.SET_NULL)
    course = models.ForeignKey(Courses, null=True, on_delete=models.SET_NULL)
    gender = models.CharField(max_length=10, choices=[('male', 'Male'), ('female', 'Female'), ('other', 'Other')], null=True, blank=True)  # New field
    password = models.CharField(max_length=50)
    confirm_password = models.CharField(max_length=50)
    image = models.ImageField(null=True, upload_to='images/')
    otp = models.CharField(max_length=6, null=True, blank=True)  # For password reset OTP
    otp_expiry = models.DateTimeField(null=True, blank=True)  # OTP expiry time

    def __str__(self):
        return self.username

    
    '''
{
    "FullName":"pavankumar",
    "username":"pavankumar",
    "email":"pavankumar@gmail.com",
    "contact_num":"9123412365",
    "joining_date":"2023-10-25",
    "qualification":"M.Sc",
    "department":1,
    "course":1,
    "password":"pavankumar@123",
    "confirm_password":"pavankumar@123",
    "image": null
}
'''

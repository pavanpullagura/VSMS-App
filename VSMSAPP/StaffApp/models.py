from django.db import models
from django.contrib.auth.models import User                    
#from django.contrib.auth.models import AbstractUser

# Create your models here.
'''
class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    user_type = models.CharField(max_length=10, choices=[('student', 'Student'), ('staff', 'Staff')])
    username = models.CharField(max_length=20)
    studentFullName = models.CharField(max_length=255, blank=True, null=True)
    email = models.EmailField()
    contact_num = models.CharField(max_length=15, blank=True, null=True)
    joining_date = models.DateField(blank=True, null=True)
    course_details = models.CharField(max_length=255, blank=True, null=True)
    batch_details = models.CharField(max_length=255, blank=True, null=True)
    profile_image = models.ImageField(upload_to='profile_images/', blank=True, null=True)

    def __str__(self):
        return self.user.username
        '''

class Courses(models.Model):
    courseName = models.CharField(max_length=40)
    description = models.TextField(null=True,blank=True)
    course_image = models.ImageField(null=True,upload_to='images/', blank=True)

    def __str__(self):
        return self.courseName

class Batches(models.Model):
    course = models.ForeignKey(Courses,null=True,on_delete=models.SET_NULL)
    Batch_name = models.CharField(max_length=50)
    batch_image = models.ImageField(null=True,upload_to='images/', blank=True)

    def __str__(self):
        return self.Batch_name




class StudentLoginDetails(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    studentFullName = models.CharField(max_length=100, blank=True, null=True)
    username = models.CharField(max_length=20,unique=True)
    email= models.EmailField(unique=True)
    contact_num = models.BigIntegerField(blank=True, null=True, unique=True)
    joining_date = models.DateField( blank=True, null=True)
    password = models.CharField(max_length=50)
    confirm_password = models.CharField(max_length=50)
    course_details = models.ForeignKey(Courses,null=True,on_delete=models.SET_NULL, blank=True)
    batch_details = models.ForeignKey(Batches,null=True,on_delete=models.SET_NULL, blank=True)
    image = models.ImageField(null=True,upload_to='images/', blank=True)
    otp = models.CharField(max_length=6, null=True, blank=True)  # For password reset OTP
    otp_expiry = models.DateTimeField(null=True, blank=True)  # OTP expiry time
    certification_completed = models.BooleanField(default=False,blank=True,null=True)
    fee_cleared = models.BooleanField(default=False,blank=True,null=True)

    def __str__(self):
        return self.studentFullName
    
class StudentFeeDetails(models.Model):
    student = models.ForeignKey(StudentLoginDetails, on_delete=models.CASCADE, related_name='fee_details')
    total_fee = models.DecimalField(max_digits=10, decimal_places=2)
    paid_amount = models.DecimalField(max_digits=10, decimal_places=2)
    pending_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    payment_date = models.DateField()
   
    
    
class StudentAttendance(models.Model):
    STATUS_CHOICES = (
        ('PRESENT', 'Present'),
        ('ABSENT', 'Absent'),
    )
    student = models.ForeignKey(StudentLoginDetails,null=True,on_delete=models.SET_NULL)
    date = models.DateField()
    status = models.CharField(max_length=20)

class StudentWeeklyTests(models.Model):
    student = models.ForeignKey(StudentLoginDetails,null=True,on_delete=models.SET_NULL)
    test_date = models.DateField()
    obtained_marks = models.IntegerField()
    total_marks = models.IntegerField()
    average_marks = models.FloatField(null=True,blank=True)

class StudentMockInterviews(models.Model):
    student = models.ForeignKey(StudentLoginDetails,null=True,on_delete=models.SET_NULL)
    interview_date = models.DateField()
    obtained_score = models.FloatField()
    total_score = models.IntegerField()
    average_score = models.FloatField(null=True,blank=True)

class UnconfirmedStudents(models.Model):
    studentFullName = models.CharField(max_length=100)
    username = models.CharField(max_length=20)
    email= models.EmailField()
    contact_num = models.BigIntegerField()
    joining_date = models.DateField()
    password = models.CharField(max_length=50)
    confirm_password = models.CharField(max_length=50)
    course_details = models.CharField(max_length=50)
    batch_details = models.CharField(max_length=50)
    image = models.ImageField(null=True,upload_to='images/')

    def __str__(self):
        return self.studentFullName


class ContactedPersonsDetails(models.Model):
    name = models.CharField(max_length=100)
    email=models.EmailField()
    contact_num = models.BigIntegerField()
    message = models.TextField()

    def __str__(self):
        return self.name
    
class NewEnrolledStudentsModel(models.Model):
    GRADUATION_CHOICES = [
        ('B.Tech', 'B.Tech'),
        ('B.E', 'B.E'),
        ('B.Sc', 'B.Sc'),
        ('B.Com', 'B.Com'),
        ('B.A', 'B.A'),
    ]

    SPECIALIZATION_CHOICES = {
        'B.Tech': ['CSE','IT', 'EEE', 'ECE', 'Civil Engineering', 'Mechanical Engineering', 'Electrical Engineering', 'Aerospace Engineering', 'Biotechnology', 'Chemical Engineering', 'Textile Engineering', 'Automobile Engineering', 'BME', 'ENE', 'Industrial Engineering'],
        'B.E': ['Computer Engineering (CE)','Electronics and Communication Engineering (ECE)', 'Mechanical Engineering (ME)', 'Electrical Engineering', 'Aerospace Engineering','Civil Engineering','Biomedical Engineering (BME)', 'Chemical Engineering', 'Textile Engineering', 'Automobile Engineering', 'BME', 'ENE', 'Industrial Engineering','Robotics and Automation Engineering (RAE)'],
        'B.Sc': ['MPCS', 'MSCS', 'MPC', 'BZC', 'MEC'],
        'B.Com': ['Computers', 'Accounting and Finance', 'Management', 'Marketing', 'Human Resource Management', 'Financial Management', 'Cost and Management Accounting', 'Banking and Insurance'],
    }

    GENDER_CHOICES = [
        ('Male', 'Male'),
        ('Female', 'Female'),
        ('Other', 'Other'),
    ]

    JOINING_MONTH_PREFERENCE_CHOICES = [
        ('this month', 'This Month'),
        ('next month', 'Next Month'),
        ('after 1 month', 'After 1 Month'),
        ('after 2 months', 'After 2 Months'),
    ]

    studentFirstName = models.CharField(max_length=100)
    studentLastName = models.CharField(max_length=100)
    dateOfBirth = models.DateField()
    graduation = models.CharField(max_length=20, choices=GRADUATION_CHOICES)
    specialization = models.CharField(max_length=100)
    passedOutYear = models.IntegerField()
    address = models.TextField()
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES)
    email = models.EmailField()
    contact_num = models.CharField(max_length=15)
    selectCourse = models.ForeignKey(Courses, on_delete=models.CASCADE)
    joiningMonthPreference = models.CharField(max_length=20, choices=JOINING_MONTH_PREFERENCE_CHOICES)

class GalleryImagesTypes(models.Model):
    category_name = models.CharField(max_length=100)
    category_description = models.TextField()

    def __str__(self):
        return self.category_name

class GalleryImages(models.Model):
    category = models.ForeignKey(GalleryImagesTypes, null=True,blank=True,on_delete=models.SET_NULL)
    image = models.ImageField()
    description = models.TextField(blank=True,null=True)

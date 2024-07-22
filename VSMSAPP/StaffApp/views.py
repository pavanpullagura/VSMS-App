from django.shortcuts import render,get_object_or_404
from django.http import JsonResponse
from . import forms
from .models import StudentLoginDetails,Courses,Batches,StudentAttendance,StudentMockInterviews,StudentWeeklyTests
from . import models
from django.contrib import messages
from datetime import date
from rest_framework.response import Response
from rest_framework.views import APIView
from datetime import date, timedelta, datetime
import random
import string
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from . import serializers
from AdminApp.serializers import StaffLoginSerializer,UserSerializer,StaffDetailsSerializer,StaffDetailsSerializerForProfileInfo
from AdminApp.models import StaffDetails
from rest_framework import status
from rest_framework.status import HTTP_200_OK,HTTP_201_CREATED,HTTP_400_BAD_REQUEST,HTTP_404_NOT_FOUND
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated,IsAdminUser
from rest_framework.decorators import permission_classes,parser_classes
from django.core.mail import send_mail
from django.utils.crypto import get_random_string
from rest_framework import generics
from django.conf import settings
from rest_framework import viewsets, permissions
from django.db.models import Q
from rest_framework.parsers import MultiPartParser
from django.contrib.auth.tokens import default_token_generator
from django.contrib.auth.decorators import login_required
#from django.core.paginator import Paginator
from rest_framework.pagination import PageNumberPagination

# Create your views here.
from django.utils import timezone
from datetime import timedelta
from .permissions import IsStaffUser
from django.contrib.auth.mixins import LoginRequiredMixin




@api_view(['GET'])
@permission_classes([IsAuthenticated])
def staffUserProfile(request, uname):
    try:
        userRecord = StaffDetails.objects.filter(username=uname)
        seriali = serializers.GetStaffProfileSerializer(userRecord, many=True, context={'request': request})
        print('MYOBJECT',seriali.data)
        return Response(data={"profileObj": seriali.data}, status=status.HTTP_200_OK)
    except models.StudentLoginDetails.DoesNotExist:
        return Response({"detail": "User not found"}, status=status.HTTP_404_NOT_FOUND)

class StaffProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, staffId):
        try:
            staff = StaffDetails.objects.get(id=staffId)
            staffSerializer = StaffDetailsSerializerForProfileInfo(staff)
            return Response(staffSerializer.data)
        except StaffDetails.DoesNotExist:
            return Response({'error': 'Staff not found'}, status=status.HTTP_404_NOT_FOUND)

    def put(self, request, staffId):
        try:
            staff = StaffDetails.objects.get(id=staffId)
            serializer = StaffDetailsSerializerForProfileInfo(staff, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            print(serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except StaffDetails.DoesNotExist:
            return Response({'error': 'Staff not found'}, status=status.HTTP_404_NOT_FOUND)

class StaffProfilePictureUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, staffId):
        try:
            staff = StaffDetails.objects.get(id=staffId)
            if 'image' in request.FILES:
                staff.image = request.FILES['image']
                staff.save()
                return Response({'message': 'Profile picture updated successfully'}, status=status.HTTP_200_OK)
            else:
                print('image not provided')
                return Response({'error': 'No image provided'}, status=status.HTTP_400_BAD_REQUEST)
        except StaffDetails.DoesNotExist:
            return Response({'error': 'Staff not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET','POST'])
@permission_classes([IsAuthenticated,IsStaffUser])
def studentAttendanceList(request,bid):
    students = StudentLoginDetails.objects.filter(batch_details_id=bid)
    if request.method=='POST':
        data = request.data
        for attendance in data.get('attendance', []):
            student_id = attendance.get('student_id')
            date = attendance.get('date')
            status = attendance.get('status')

            student = StudentLoginDetails.objects.get(id=student_id)
            attendance_record, created = StudentAttendance.objects.get_or_create(student=student, date=date)
            attendance_record.status = status
            attendance_record.save()

        return Response({'message': 'Attendance updated successfully'}, status=HTTP_200_OK)

    #print('STUDENTS Details:',students)
    today = timezone.now().date()
    first_day_of_month = today.replace(day=1)
    days_in_month = (today.replace(month=today.month % 12 + 1, day=1) - timedelta(days=1)).day
    attendance_data = []
    for student in students:
        attendance_records = StudentAttendance.objects.filter(
            student=student, 
            date__range=[first_day_of_month, today]
        )
        attendance_dict = {record.date: record.status for record in attendance_records}
        #print('ATTENDANCE DICT: ',attendance_dict)
        # Fill missing days with 'ABSENT'
        for day in range(1, days_in_month + 1):
            date = first_day_of_month.replace(day=day)
            if date not in attendance_dict:
                attendance_dict[date] = 'ABSENT'
        #print('ATTENDANCE DICTIONARY AFTER ADDING DATA: ',attendance_dict)
        attendance_data.append({
            'student': serializers.StudentLoginDetailsSerializer(student).data,
            'attendance': [{'date': date, 'status': status} for date, status in attendance_dict.items()]
        })
    #print('ATTENDANCE DATA OF STUDENTS: ',attendance_data)
    return Response(attendance_data, status=HTTP_200_OK)
'''
@api_view(['GET','POST'])
@permission_classes([IsAuthenticated,IsStaffUser])
def updateAttendance(request):
    data = request.data
    attendance = StudentAttendance.objects.filter(student_id=data['student_id'], date=data['date']).first()
    if attendance:
        serializer = serializers.GetStudentAttendanceSerializer(attendance, data=data, partial=True)
    else:
        serializer = serializers.GetStudentAttendanceSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)'''
'''
class StudentAttendanceList(APIView):
    permission_classes = [IsAuthenticated, IsStaffUser]

    def get(self, request, batch_id, format=None):
        students = StudentLoginDetails.objects.filter(batch_details_id=batch_id)
        today = timezone.now().date()
        first_day_of_month = today.replace(day=1)
        days_in_month = (today.replace(month=today.month % 12 + 1, day=1) - timedelta(days=1)).day

        attendance_data = []

        for student in students:
            attendance_records = StudentAttendance.objects.filter(
                student=student, 
                date__range=[first_day_of_month, today]
            )
            attendance_dict = {record.date: record.status for record in attendance_records}

            # Fill missing days with 'ABSENT'
            for day in range(1, days_in_month + 1):
                date = first_day_of_month.replace(day=day)
                if date not in attendance_dict:
                    attendance_dict[date] = 'ABSENT'

            attendance_data.append({
                'student': serializers.StudentLoginDetailsSerializer(student).data,
                'attendance': [{'date': date, 'status': status} for date, status in attendance_dict.items()]
            })

        return Response(attendance_data)
'''
    
@api_view(['POST'])
def staffLogin(request):
    serializer = StaffLoginSerializer(data=request.data)
    print(request.data)
    staffObj = StaffDetails.objects.get(username=request.data['username'])
    staffdept = staffObj.department_id
    if serializer.is_valid():
        user = serializer.validated_data['user']
        print(user)
        print(user.is_staff)
        #staffObj = StaffDetails.objects.get(user=user)
        #serObj = StaffLoginSerializer(staffObj,many=True)
        if user.is_staff:
            token, created = Token.objects.get_or_create(user=user)
            print('sTaff department id',staffdept)
            return Response(data={'token': token.key,'usertype':'staff','staffdept':staffdept}, status=status.HTTP_200_OK)
        else:
            return Response('You are not an authorized staff',status=status.HTTP_401_UNAUTHORIZED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated,IsStaffUser])
def staffLogout(request):
    print(request)
    try:
        request.user.auth_token.delete()
        return Response(status=status.HTTP_200_OK)
    except Exception as e:
        return Response(status=status.HTTP_400_BAD_REQUEST)
    
class AddNewBatch(APIView):
    def post(self,request):
        course = request.data['course']
        batch_name = request.data['Batch_name']
        courseObj = models.Courses.objects.get(id=int(course))
        batch = models.Batches.objects.create(course=courseObj,Batch_name=batch_name)
        return Response('BAtch created successfully!',status=HTTP_201_CREATED)


#already in use so try to delete UnconfirmedStudentsList
'''
class UnconfirmedStudentsList(generics.ListAPIView):
    queryset = models.UnconfirmedStudents.objects.all()
    serializer_class = serializers.AskToRegisterSerializer
    permission_classes = [IsAuthenticated,IsStaffUser]'''

class ConfirmRegistration(generics.GenericAPIView):
    #login_url = 'staffloginurl'
    permission_classes = [IsAuthenticated,IsStaffUser]

    def post(self, request, pk, format=None):
        try:
            student = models.UnconfirmedStudents.objects.get(id=pk)
            courseObj = models.Courses.objects.get(id = student.course_details)
            batchObj = models.Batches.objects.filter(id=student.batch_details,course=courseObj)
            print(batchObj)
            generated_password = get_random_string(8)
            user = User.objects.create_user(username=student.username, email=student.email, password=generated_password)
            student_details = models.StudentLoginDetails.objects.create(
                user = user,
                studentFullName=student.studentFullName,
                username=student.username,
                email=student.email,
                contact_num=student.contact_num,
                joining_date=student.joining_date,
                password=generated_password,
                confirm_password=generated_password,
                course_details=courseObj,
                batch_details=batchObj.first(),
                image=student.image
            )
            
            #msg = f"Your Account Details,Username: {student.username}\nPassword: {generated_password}\nYou can change your password after your first login",
            student.delete()
            send_mail(
                'Registration Confirmed',
                f"Your Account Details,Username: {student.username}\nPassword: {generated_password}\nYou can change your password after your first login",
                settings.DEFAULT_FROM_EMAIL,
                ['pullagurapavankumar153@gmail.com'],
                fail_silently=False,
            )
            return Response({'status': 'confirmed'}, status=status.HTTP_200_OK)
        except models.UnconfirmedStudents.DoesNotExist:
            return Response({'status': 'not found'}, status=status.HTTP_404_NOT_FOUND)

class DeclineRegistration(LoginRequiredMixin,generics.GenericAPIView):
    login_url = 'staffloginurl'
    permission_classes = [IsAuthenticated,IsStaffUser]

    def post(self, request, pk, format=None):
        try:
            student = models.UnconfirmedStudents.objects.get(pk=pk)
            send_mail(
                'Registration Declined',
                'Your registration has been declined.',
                settings.DEFAULT_FROM_EMAIL,
                ['pullagurapavankumar153@gmail.com'],#insted of this i can use [student.email] => it will give me email address mentioned while registering student
                fail_silently=False,
            )
            student.delete()
            return Response({'status': 'declined'}, status=status.HTTP_200_OK)
        except models.UnconfirmedStudents.DoesNotExist:
            return Response({'status': 'not found'}, status=status.HTTP_404_NOT_FOUND)



class BatchViewSet(generics.ListAPIView):
    queryset = models.Batches.objects.all()
    serializer_class = serializers.BatchDetailsSerializer
    permission_classes = [permissions.IsAuthenticated]


class StudentViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.StudentLoginDetailsSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        batch_id = self.request.query_params.get('batch_id')
        return models.StudentLoginDetails.objects.filter(batch_id=batch_id)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        attendances = instance.attendances.all()
        total_attendance = attendances.count()
        present_days = attendances.filter(status=True).count()
        average_attendance = (present_days / total_attendance) * 100 if total_attendance else 0
        data = {
            'student': self.get_serializer(instance).data,
            'average_attendance': average_attendance
        }
        return Response(data)

#to get all batches course students attendances .. etc
'''
class ConfirmStudentView(generics.UpdateAPIView):
    serializer_class = serializers.StudentLoginDetailsSerializer
    permission_classes = [IsAuthenticated]

    def update(self, request, *args, **kwargs):
        student = self.get_object()
        student.is_confirmed = True
        student.save()
        # Additional logic to create User and send email
        return Response(status=status.HTTP_204_NO_CONTENT)
'''
def addNewCourse(request):
    emptyForm = forms.AddCourseForm()
    if request.method == 'POST':
        dataForm = forms.AddCourseForm(request.POST)
        if dataForm.is_valid():
            dataForm.save()
            messages.success(request,'DAta successfully inserted')
            return render(request,'courseform.html',{'form':emptyForm})
        else:
            messages.error(request,'Failed to insert data')
            return render(request,'courseform.html',{'form':dataForm})
    return render(request,'courseform.html',{'form':emptyForm})
'''          #it is for forms not for api
def addNewBatch(request):
    emptyForm = forms.AddBatchForm()
    if request.method == 'POST':
        dataForm = forms.AddBatchForm(request.POST)
        if dataForm.is_valid():
            dataForm.save()
            messages.success(request,'DAta successfully inserted')
            return render(request,'addbatchform.html',{'form':emptyForm})
        else:
            messages.error(request,'Failed to insert data')
            return render(request,'addbatchform.html',{'form':dataForm})
    return render(request,'addbatchform.html',{'form':emptyForm})'''

@api_view(['POST'])
def studentRegistration(request):
    data = request.data
    default_password = get_random_string(8)
    user = User.objects.create_user(username=data['username'],email=data['email'], password=default_password)
    
    student = models.StudentLoginDetails.objects.create(
        user=user,
        studentFullName=data['studentFullName'],
        username=data['username'],
        email=data['email'],
        contact_num=data.get('contact_num', None),
        joining_date=data.get('joining_date', None),
        course_details=Courses.objects.get(id=data['course_details']),
        batch_details=Batches.objects.get(id=data['batch_details'])
    )
     # Optionally, send an email to the new admin with the password
    print('password: ',default_password)
    send_mail(
        'Credentials of Student Account',
        f'Your Student account has been created. Your name: {data['studentFullName']}   , your username to login: {data['username']} and \n password is: {default_password}',
        settings.DEFAULT_FROM_EMAIL,
        ['pullagurapavankumar153@gmail.com'],
        fail_silently=False,
    )
    return Response({'message': 'Student registered successfully!'}, status=HTTP_201_CREATED)
'''
def studentRegistration(request):
    emptyForm = forms.RegisterStudentForm()
    if request.method == 'POST':
        dataForm = forms.RegisterStudentForm(request.POST,request.FILES)
        if dataForm.is_valid():
            dataForm.save()
            messages.success(request,'DAta successfully inserted')
            return render(request,'regStudent.html',{'form':emptyForm})
        else:
            messages.error(request,'Failed to insert data')
            return render(request,'regStudent.html',{'form':dataForm})

    return render(request,'regStudent.html',{'form':emptyForm})'''

def studentDetails(request):
    stds = StudentLoginDetails.objects.all()
    return render(request,'getAllStudents.html',{'data':stds})

@api_view(['GET'])
def allCourses(request):
    courses = models.Courses.objects.all()
    courseSerialObj = serializers.AllCoursesDetailsSerializer(courses,many=True)
    #print('OBJECT:',courseSerialObj)
    print(courseSerialObj.data)
    return Response(courseSerialObj.data,status=status.HTTP_200_OK)
    #return Response(courseSerialObj.errors,status=status.HTTP_400_BAD_REQUEST)
    #return render(request,'course.html',{'data':courses})

@api_view(['GET'])
def allBatches(request,pk):
    batches = Batches.objects.filter(course_id=pk)
    serializeObj = serializers.BatchDetailsSerializer(batches,many=True)
    print('Batch Object:- ',serializeObj.data)
    return Response(serializeObj.data,status=status.HTTP_200_OK)
    #return render(request,'getallbatches.html',{'data':batch})




#result = MyModel.objects.filter(Q(condition1=value1) & Q(condition2=value2))

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated,IsStaffUser])
@login_required(login_url='staffloginurl')
def allStudentsInBatch(request, cid, bid):
    try:
        courseObj = models.Courses.objects.get(id=cid)
        print('Course Object: ', courseObj)
    except models.Courses.DoesNotExist:
        return Response({'error': 'Course not found'}, status=status.HTTP_404_NOT_FOUND)

    try:
        batch = models.Batches.objects.get(id=bid, course=courseObj)
        print('Batch Object: ', batch)
    except models.Batches.DoesNotExist:
        return Response({'error': 'Batch not found'}, status=status.HTTP_404_NOT_FOUND)

    studentsObj = models.StudentLoginDetails.objects.filter(course_details=courseObj, batch_details=batch)
    print('Student Object: ', studentsObj)
    
    serialObj = serializers.AllStudentsInBatchSerializer(studentsObj, many=True)
    return Response(serialObj.data, status=status.HTTP_200_OK)
'''
@api_view(['GET','POST'])
def allStudentsInBatch(request,cid,bid):
    courseObj = models.Courses.objects.get(id=cid)
    print('Course Object:- ',courseObj)
    batch = models.Batches.objects.filter(Q(id=bid) & Q(course=courseObj))
    print('Batch Object: ',batch)
    studentsObj = models.StudentLoginDetails.objects.filter(course_details=courseObj)
    print('Student Obect',studentsObj)
    studentsObjMain = studentsObj.objects.filter(batch_details = batch)
   
    
    print('Student Obect2',studentsObjMain)
    serialObj = serializers.AllStudentsInBatchSerializer(studentsObjMain,many=True)
    return Response(serialObj.data,status=status.HTTP_200_OK)
    '''



class AllStudentMonthlyAttendanceView(APIView):

    def get(self, request, year, month):
        # Fetch all students
        students = models.StudentLoginDetails.objects.all()
        attendance_data = []

        # Calculate days in month
        num_days = (date(year, month + 1, 1) - timedelta(days=1)).day

        for student in students:
            student_data = serializers.StudentLoginDetailsSerializer(student).data
            attendance = []

            for day in range(1, num_days + 1):
                attendance_date = date(year, month, day)
                record = models.StudentAttendance.objects.filter(student=student, date=attendance_date).first()
                
                if record:
                    attendance.append('✔' if record.status == 'Present' else '✖')
                else:
                    attendance.append('✖')

            student_data['attendance'] = attendance
            attendance_data.append(student_data)
        print('ATTENDACE DATA:- ',attendance_data)

        return Response(attendance_data)
    
#checking functionality:
from .permissions import IsStaffUser


@api_view(['GET'])
def studentsList(request):
    students = models.StudentLoginDetails.objects.all()
    serializer = serializers.StudentLoginObjectsReturnSerializer(students, many=True)
    print('serializer data',serializer.data)
    return Response(serializer.data,status=status.HTTP_200_OK)
    
class StudentList(APIView):
    permission_classes = [IsAuthenticated, IsStaffUser]

    def get(self, request, batch_id):
        students = models.StudentLoginDetails.objects.filter(batch_details_id=batch_id)
        print(students)
        serializer = serializers.StudentLoginObjectsReturnSerializer(students, many=True)
        print('serializer data',serializer.data)
        return Response(serializer.data)







def addStudentAttendance(request,stdno):
    std = StudentLoginDetails.objects.get(id=stdno)
    today = date.today()
    print(today)
    if request.method=='POST':
        name = request.POST['student']
        d = request.POST['date']
        stat = request.POST['status']
        stdObj = StudentLoginDetails.objects.get(studentFullName=name)
        StudentAttendance.objects.create(student=stdObj,date=d,status=stat)
        return render(request,'addAttendance.html',{'id':std,'today':str(today)})

    return render(request,'addAttendance.html',{'id':std,'today':str(today)})

def getallStdObjs():
    stds = models.StudentLoginDetails.objects.all()
    serialObj = serializers.StudentLoginObjectsReturnSerializer(stds,many=True)
    return serialObj.data

def getallCourses():
    crs =  models.Courses.objects.all()
    serialObj = serializers.AllCoursesDetailsSerializer(crs,many=True)
    return serialObj.data

def getallBatches():
    bts =  models.Batches.objects.all()
    serialObj = serializers.BatchDetailsSerializer(bts,many=True)
    return serialObj.data

@api_view(['GET'])
def allStudentsAttendance(request):
    stds = StudentAttendance.objects.all()
    serializerObj = serializers.AllStdsAttendanceserializer(stds,many=True)
    print('sErial OBj',serializerObj)
    stdObj = getallStdObjs()
    courses = getallCourses()
    batches = getallBatches()
    return Response(data={'att':serializerObj.data,'stdObj':stdObj,'courses':courses,'batches':batches},status=HTTP_200_OK)
    #return render(request,'allstdattendance.html',{'data':stds})



class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10  # Adjust the number of items per page as needed
    page_size_query_param = 'page_size'
    max_page_size = 100

@api_view(['GET'])
@permission_classes([IsAuthenticated, IsStaffUser])
def get_allStudents(request):
    stds = StudentLoginDetails.objects.all()
    paginator = StandardResultsSetPagination()
    result_page = paginator.paginate_queryset(stds, request)
    serializer = serializers.StudentLoginObjectsReturnSerializer(result_page, many=True)
    courses = getallCourses()
    batches = getallBatches()
    print(paginator.get_paginated_response({
        'stdData': serializer.data,
        'crs': courses,
        'bts': batches
    }))
    return paginator.get_paginated_response({
        'stdData': serializer.data,
        'crs': courses,
        'bts': batches
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated,IsStaffUser])
@login_required(login_url='staffloginurl')
def get_all_students(request):
    stds=StudentLoginDetails.objects.all()
    serializerObj = serializers.StudentLoginObjectsReturnSerializer(stds,many=True)
    courses = getallCourses()
    batches = getallBatches()
    
    return Response(data={'stdData':serializerObj.data,'crs':courses,'bts':batches},status=HTTP_200_OK)


@api_view(['GET'])
def fee_details(request, pk):
    student = StudentLoginDetails.objects.get(pk=pk)
    fee_details = models.StudentFeeDetails.objects.filter(student=student)
    serializer = serializers.StudentFeeDetailsSerializer(fee_details, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def add_fee_detail(request, student_id):
    student = get_object_or_404(models.StudentLoginDetails, id=student_id)
    print('Student obj',student)
    if request.data['pending_amount'] == (0 or '0'):
        student.fee_cleared = True
        student.save()
    else: 
        student.fee_cleared = False
        student.save()
    serializerObj = serializers.StudentFeeDetailsSerializer(data=request.data)
    print('serializ obj',serializerObj)
    if serializerObj.is_valid():
        print('serializer validated')
        serializerObj.save(student=student)
        return Response(serializerObj.data, status=status.HTTP_201_CREATED)
    return Response(serializerObj.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PATCH'])
def modify_student_fee_status(request, student_id):
    student = get_object_or_404(models.StudentLoginDetails, id=student_id)
    student.certification_completed = request.data.get("certification_completed", student.certification_completed)
    student.save()
    return Response({"status": "updated"}, status=status.HTTP_200_OK)

from django.db.models import Count, Case, When, IntegerField
@api_view(['GET'])
def get_student_average_attendance(request, student_id):
    student = get_object_or_404(StudentLoginDetails, id=student_id)
    attendance_records = models.StudentAttendance.objects.filter(student=student)
    print('attendace records',attendance_records)
    # Get the highest number of 'PRESENT' attendance status across all students
    highest_present_days = models.StudentAttendance.objects.values('student').annotate(present_days=Count(Case(When(status='PRESENT', then=1), output_field=IntegerField()))).order_by('-present_days').first()['present_days']
    print('heighest present days', highest_present_days)
    # Calculate the average attendance of the specific student
    total_days = attendance_records.count()
    print('total days',total_days)
    present_days = attendance_records.filter(status='PRESENT').count()
    average_attendance = (present_days / highest_present_days) * 100 if highest_present_days > 0 else 0
    print(average_attendance)
    return Response({"average_attendance": average_attendance}, status=status.HTTP_200_OK)

# for dynamically get different types of data of specific student i am writting again these two view fucntions
@api_view(['GET'])
def get_student_average_mock_performance(request, student_id):
    student = get_object_or_404(models.StudentLoginDetails, id=student_id)
    mock_performance_records = models.StudentMockInterviews.objects.filter(student=student)
    total_interviews = mock_performance_records.count()
    total_score = sum(record.obtained_score for record in mock_performance_records)
    average_mock_performance = (total_score / total_interviews) if total_interviews > 0 else 0
    return Response({"average_mock_performance": average_mock_performance}, status=status.HTTP_200_OK)


@api_view(['GET'])
def get_student_average_weekly_tests(request, student_id):
    student = get_object_or_404(models.StudentLoginDetails, id=student_id)
    weekly_tests_records = models.StudentWeeklyTests.objects.filter(student=student)
    total_tests = weekly_tests_records.count()
    total_marks = sum(record.obtained_marks for record in weekly_tests_records)
    average_weekly_tests = (total_marks / total_tests) if total_tests > 0 else 0
    return Response({"average_weekly_tests": average_weekly_tests}, status=status.HTTP_200_OK)





@api_view(['GET'])
@permission_classes([IsAuthenticated,IsStaffUser])
def search_students(request):
    query = request.GET.get('query', '')
    search_type = request.GET.get('type', 'name')  # Get the search type from the query params

    if search_type == 'name':
        students = StudentLoginDetails.objects.filter(Q(studentFullName__icontains=query))
    elif search_type == 'id':
        students = StudentLoginDetails.objects.filter(Q(id__icontains=query))
    elif search_type == 'contact_num':
        students = StudentLoginDetails.objects.filter(Q(contact_num__icontains=query))
    elif search_type == 'email':
        students = StudentLoginDetails.objects.filter(Q(email__icontains=query))
    
    else:
        students = StudentLoginDetails.objects.all()
        #students = StudentLoginDetails.objects.none()
    serializer = serializers.StudentLoginDetailsSerializer(students, many=True)
    return Response(serializer.data,status=HTTP_200_OK)

@api_view(['GET'])
def fetch_student_reports(request, student_id):
    student = get_object_or_404(StudentLoginDetails, id=student_id)
    has_test_report = StudentWeeklyTests.objects.filter(student=student).exists()
    has_mock_report = StudentMockInterviews.objects.filter(student=student).exists()
    return JsonResponse({'hasTestReport': has_test_report, 'hasMockReport': has_mock_report})

'''
@api_view(['GET'])
def fetch_student_reports(request, student_id):
    student = get_object_or_404(StudentLoginDetails, id=student_id)
    has_test_report = StudentWeeklyTests.objects.filter(student=student)
    testSerializer = serializers.StudentWeeklyTestsSerializeer(has_test_report,many=True)
    has_mock_report = StudentMockInterviews.objects.filter(student=student)
    mockSerializer = serializers.StudentMockTestPerformanceSerializer(has_mock_report,many=True)
    return Response(data={'hasTestReport': testSerializer, 'hasMockReport': mockSerializer},status=HTTP_200_OK)'''

@api_view(['POST'])
@permission_classes([IsAuthenticated,IsStaffUser])
def submit_weekly_test(request):
    serializer = serializers.StudentWeeklyTestsSerializeer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=HTTP_201_CREATED)
    return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated,IsStaffUser])
def submit_mock_interview(request):
    print(request.data)
    serializer = serializers.StudentMockTestPerformanceSerializer(data=request.data)
    print('SERIAL OBj',serializer)
    if serializer.is_valid():
        serializer.save()
        print('SERializer successfully validated')
        return Response(serializer.data, status=HTTP_201_CREATED)
    return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated,IsStaffUser])
def get_student_performance(request, stduname):
    std = models.StudentLoginDetails.objects.get(username=stduname)
    tests = StudentWeeklyTests.objects.filter(student=std)
    serializer = serializers.StudentWeeklyTestsSerializeer(tests, many=True)
    return Response(serializer.data,status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_student_performance2(request, stduname):
    std = models.StudentLoginDetails.objects.get(username=stduname)
    tests = StudentWeeklyTests.objects.filter(student=std)
    serializer = serializers.StudentWeeklyTestsSerializeer(tests, many=True)
    return Response(serializer.data,status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated,IsStaffUser])
def get_student_mock_interviews(request, stduname):
    std = models.StudentLoginDetails.objects.get(username=stduname)
    interviews = StudentMockInterviews.objects.filter(student=std)
    serializer = serializers.StudentMockTestPerformanceSerializer(interviews, many=True)
    return Response(serializer.data)
@api_view(['GET'])
def get_weekly_test_report(request, student_id):
    reports = StudentWeeklyTests.objects.filter(student_id=student_id)
    serializer = serializers.StudentWeeklyTestsSerializeer(reports, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_mock_interview_report(request, student_id):
    reports = StudentMockInterviews.objects.filter(student_id=student_id)
    serializer = serializers.StudentMockTestPerformanceSerializer(reports, many=True)
    return Response(serializer.data)

#@csrf_exempt
@api_view(['PUT'])
def update_weekly_test(request, report_id):
    report = get_object_or_404(StudentWeeklyTests, id=report_id)
    serializer = serializers.StudentWeeklyTestsSerializeer(report, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#@csrf_exempt
@api_view(['PUT'])
def update_mock_interview(request, report_id):
    report = get_object_or_404(StudentMockInterviews, id=report_id)
    print('report',report)
    serializer = serializers.StudentMockTestPerformanceSerializer(report, data=request.data)
    print('serialize obj',serializer)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



def addStudentWeeklyTest(request,stdno):
    std = get_object_or_404(StudentLoginDetails, id=stdno)
    emptyForm = forms.StudentWeeklyTestsForm()
    if request.method=='POST':
        dataForm = forms.StudentWeeklyTestsForm(request.POST)
        if dataForm.is_valid():
            attendance = dataForm.save(commit=False)
            attendance.student = std
            attendance.save()
        else:
            return render(request,'addWeeklyTestReport.html',{'form':dataForm,'id':std})
        return render(request,'addWeeklyTestReport.html',{'form':emptyForm,'id':std})
    return render(request,'addWeeklyTestReport.html',{'form':emptyForm,'id':std})



def createStudentUser(request,data):
    if request.method == 'POST':
        newdata = {"username":data['username'],"email":data['email'],"password":data['password']}
        user_serializer = serializers.UserSerializer(data=newdata)
        if user_serializer.is_valid():
            user = user_serializer.save()
            token, created = Token.objects.get_or_create(user=user)
            messages.success(request, 'Data successfully inserted')
            return (token)
        else:
            messages.error(request, 'Error while validating data')
            return user_serializer.errors
    
    unconfirmed_students = models.UnconfirmedStudents.objects.all()
    serialObj = serializers.AskToRegisterSerializer(unconfirmed_students, many=True)
    return Response(serialObj.data, status=status.HTTP_200_OK)
@api_view(['GET','POST'])
@permission_classes([IsAuthenticated,IsStaffUser])
def checkNewRegistrations(request):
    
    #empDetails = EmpSerializer(empData,many=True)
    #return Response(empDetails.data,status=HTTP_200_OK)
    unConfirmedStdData = models.UnconfirmedStudents.objects.all()
    serialObj = serializers.AskToRegisterSerializer(unConfirmedStdData,many=True)
    if request.method=='POST':
        #print(request.data)
        token = createStudentUser(request,request.data)
        print('token',token)
        confirmedStdObj = serializers.MakeRegisterSerializer(data=request.data)
        #print(confirmedStdObj)
        if confirmedStdObj.is_valid():
            print('object was valid:',confirmedStdObj)
            confirmedStdObj.save()
            confirmedStdObj.removeRecord(request.data)
            messages.success(request,'DAta successfully inserted')
            #return render(request,'registerStdbythemself.html',{'form':emptyForm})
            return Response(data={'token': token.key}, status=status.HTTP_201_CREATED)
        else:
            messages.error(request,'Error while validating data')
            print('confirmedStdObj has invalid data',confirmedStdObj)
            return Response(data={'token': token.key}, status=status.HTTP_200_OK)
    return Response(serialObj.data,status=status.HTTP_200_OK)
    #return render(request,'unconfirmedStds.html',{'data':unConfirmedStdData})
#modify this according to new model changes(one-to-one field)
class ForgotPassword(APIView):
    def post(self, request):
        username = request.data.get('username')
        email = request.data.get('email')
        try:
            user = User.objects.get(username=username, email=email)
            otp = get_random_string(6, '0123456789')
            user.staffdetails.otp = otp
            user.staffdetails.otp_expiry = timezone.now() + timedelta(minutes=10)
            user.staffdetails.save()
            send_mail(
                'Your OTP',
                f"Your OTP is {otp}",
                settings.DEFAULT_FROM_EMAIL,
                ['pullagurapavankumar153@gmail.com'],
            )
            return Response({'message': 'OTP sent'}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)

class ResetPassword(APIView):
    def post(self, request):
        username = request.data.get('username')
        otp = request.data.get('otp')
        new_password = request.data.get('new_password')
        try:
            user = User.objects.get(username=username)
            staff_details = user.staffdetails
            if staff_details.otp == otp and timezone.now() < staff_details.otp_expiry:
                user.set_password(new_password)
                user.save()
                staff_details.password = new_password
                staff_details.otp = None
                staff_details.otp_expiry = None
                staff_details.save()
                return Response({'message': 'Password reset successfully'}, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'Invalid OTP or OTP expired'}, status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            return Response({'error': 'User does not exist'}, status=status.HTTP_400_BAD_REQUEST)


#creating token for students
# views.py
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.response import Response

class CustomObtainAuthToken(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        response = super(CustomObtainAuthToken, self).post(request, *args, **kwargs)
        token = Token.objects.get(key=response.data['token'])
        return Response({'token': token.key, 'user_id': token.user_id})
    
# Overview for frontend

def generate_password(length=8):
    characters = string.ascii_letters + string.digits
    return ''.join(random.choice(characters) for i in range(length))



class UnconfirmedStudentsList(APIView):
    permission_classes = [IsAuthenticated, IsStaffUser]

    def get(self, request):
        students = models.UnconfirmedStudents.objects.all()
        serializer = serializers.AskToRegisterSerializer(students, many=True)
        return Response(serializer.data)

    def post(self, request):
        data = request.data
        if data.get("action") == "accept":
            student = models.UnconfirmedStudents.objects.get(id=data.get("student_id"))
            password = generate_password()
            user = User.objects.create_user(username=student.username, email=student.email, password=password)
            batchObj = models.Batches.objects.get(Batch_name=student.batch_details)
            courseObj = models.Courses.objects.get(courseName = student.course_details)
            student_details = models.StudentLoginDetails.objects.create(
                user=user,
                studentFullName=student.studentFullName,
                username=student.username,
                email=student.email,
                contact_num=student.contact_num,
                joining_date=student.joining_date,
                course_details=courseObj,
                batch_details=batchObj,
                image=student.image
            )
           
            send_mail(
                'Registration Successful',
                f'Your registration is successful. Your login credentials are:\nUsername: {student.username}\nPassword: {password}',
                settings.DEFAULT_FROM_EMAIL,
                ['pullagurapavankumar153@gmail.com'],
                fail_silently=False,
            )
            student.delete()
            return Response({"message": "Student accepted and email sent."}, status=status.HTTP_201_CREATED)
        elif data.get("action") == "decline":
            student = models.UnconfirmedStudents.objects.get(id=data.get("student_id"))
            send_mail(
                'Registration Declined',
                'Your registration has been declined.\nPlease Contact Administration Staff for your Registration.',
                settings.DEFAULT_FROM_EMAIL,
                ['pullagurapavankumr153@gmail.com'],
                fail_silently=False,
            )
            student.delete()
            return Response({"message": "Student declined and email sent."}, status=status.HTTP_200_OK)
        return Response({"error": "Invalid action"}, status=status.HTTP_400_BAD_REQUEST)

#update profile pic in student table not in profile table


'''
    
class ProfilePictureUpdateView(generics.UpdateAPIView):
    queryset = models.Profile.objects.all()
    serializer_class = serializers.ProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user.profile

    def patch(self, request, *args, **kwargs):
        profile = self.get_object()
        profile.profile_image = request.FILES.get('profile_image')
        profile.save()
        return Response({"detail": "Profile picture updated successfully."})'''
    

 
from django.utils.dateparse import parse_date
'''    
class StudentAttendanceList(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, batch_id):
        month = request.GET.get('month', None)
        if not month:
            return Response({"error": "Month parameter is required."}, status=400)

        students = models.StudentLoginDetails.objects.filter(batch_details_id=batch_id)
        data = []
        for student in students:
            attendances = models.StudentAttendance.objects.filter(
                student=student,
                date__startswith=month
            )
            data.append({
                'student': serializers.StudentLoginDetailsSerializer(student).data,
                'attendances': serializers.GetStudentAttendanceSerializer(attendances, many=True).data
            })
        return Response(data,status=status.HTTP_200_OK)

    def post(self, request, batch_id):
        data = request.data
        for item in data['attendance']:
            student_id = item.get('student_id')
            date = item.get('date')
            status = item.get('status')
            student = models.StudentLoginDetails.objects.get(id=student_id)
            attendance, created = models.StudentAttendance.objects.update_or_create(
                student=student, date=date, defaults={'status': status}
            )
        return Response({"message": "Attendance updated successfully."}, status=HTTP_200_OK)

'''
from django.utils.dateparse import parse_date

class StudentAttendanceList(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, batch_id):
        month = request.query_params.get('month')
        year = request.query_params.get('year')

        if not month or not year:
            month = datetime.month
            year = datetime.year

        try:
            print(month,year)
            month = (month)
            year = (year)
        except ValueError:
            return Response({"error": "Invalid month or year format."}, status=400)

        students = models.StudentLoginDetails.objects.filter(batch_details_id=batch_id)
        data = []

        for student in students:
            attendances = models.StudentAttendance.objects.filter(
                student=student,
                date__year=year,
                date__month=month
            )
            data.append({
                'student': serializers.StudentLoginDetailsSerializer(student).data,
                'attendances': serializers.GetStudentAttendanceSerializer(attendances, many=True).data
            })

        return Response(data)

    def post(self, request, batch_id):
        data = request.data
        for item in data['attendance']:
            student_id = item.get('student_id')
            date = item.get('date')
            status = item.get('status')
            student = models.StudentLoginDetails.objects.get(id=student_id)
            attendance, created = models.StudentAttendance.objects.update_or_create(
                student=student, date=date, defaults={'status': status}
            )
        return Response({"message": "Attendance updated successfully."}, status=200)


class AddAttendanceView(APIView):
    def post(self, request, batch_id):
        student_id = request.data.get('student_id')
        date = request.data.get('date')
        status = request.data.get('status')

        try:
            student = models.StudentLoginDetails.objects.get(id=student_id)
        except models.StudentLoginDetails.DoesNotExist:
            return Response({"detail": "Student not found"}, status=HTTP_404_NOT_FOUND)

        # Check if attendance already exists
        existing_attendance = models.StudentAttendance.objects.filter(student=student, date=date, status = 'PRESENT').first()
        if existing_attendance:
            return Response({"detail": "Attendance already exists"}, status=HTTP_400_BAD_REQUEST)

        # Create new attendance record for the specified student
        new_attendance = models.StudentAttendance.objects.create(
            student=student,
            date=date,
            status=status
        )

        # Automatically adds 'ABSENT' status for all other students in the batch
        batch = models.Batches.objects.get(id=batch_id)
        batch_students = models.StudentLoginDetails.objects.filter(batch_details=batch).exclude(id=student_id)
        for batch_student in batch_students:
            models.StudentAttendance.objects.get_or_create(
                student=batch_student,
                date=date,
                defaults={'status': 'ABSENT'}
            )

        serialized_attendance = serializers.GetStudentAttendanceSerializer(new_attendance)
        return Response(serialized_attendance.data, status=HTTP_201_CREATED)


class StudentWeeklyTestsList(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get(self, request, batch_id):
        students = models.StudentLoginDetails.objects.filter(batch_details_id=batch_id)
        data = []
        for student in students:
            tests = models.StudentWeeklyTests.objects.filter(student=student)
            data.append({
                'student': serializers.StudentLoginDetailsSerializer(student).data,
                'tests': serializers.StudentWeeklyTestsSerializeer(tests, many=True).data
            })
        return Response(data)

    def post(self, request, batch_id):
        data = request.data
        for item in data:
            student_id = item.get('student_id')
            test_date = item.get('test_date')
            obtained_marks = item.get('obtained_marks')
            total_marks = item.get('total_marks')
            student = StudentLoginDetails.objects.get(id=student_id)
            test, created = StudentWeeklyTests.objects.update_or_create(
                student=student, test_date=test_date, defaults={'obtained_marks': obtained_marks, 'total_marks': total_marks}
            )
        return Response({"message": "Weekly test report updated successfully."}, status=status.HTTP_200_OK)
 



# after creating overlaying component i am not using this at present
@api_view(['POST'])
@parser_classes([MultiPartParser])
def update_profile_picture(request):
    user = request.user
    profile_picture = request.FILES['profile_picture']
    
    if hasattr(user, 'studentlogindetails'):
        user_profile = user.studentlogindetails
    else:
        user_profile = user.stafflogindetails  # Adjust according to your staff model

    user_profile.profile_picture = profile_picture
    user_profile.save()

    return Response({'profile_picture': user_profile.profile_picture.url}, status=status.HTTP_200_OK)



#USER ENQUIRY DETAILS ABOUT INSTITUTE
@api_view(['POST'])
def contact_us(request):
    serializer = serializers.ContactedPersonsDetailsSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({'message': 'Message sent successfully'}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def contacted_persons_details(request):
    if request.user.staffdetails.department.departmanet_name == "Office Executives":
        contacts = models.ContactedPersonsDetails.objects.all()
        serializer = serializers.ContactedPersonsDetailsSerializer(contacts, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    else:
        return Response({"error": "You do not have permission to view this data."}, status=status.HTTP_403_FORBIDDEN)
    

@api_view(['DELETE'])
def deleteContactedMessage(request,email):
    contactObj = models.ContactedPersonsDetails.objects.get(email=email)
    contactObj.delete()
    return Response('Message deleted successfully!',status=status.HTTP_200_OK)



class EnrollListCreateView(generics.ListCreateAPIView):
    queryset = models.NewEnrolledStudentsModel.objects.all()
    serializer_class = serializers.EnrollSerializer

    def delete(self, request, pk, *args, **kwargs):
        try:
            student = models.NewEnrolledStudentsModel.objects.get(pk=pk)
            student.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except models.NewEnrolledStudentsModel.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

class CourseListView(generics.ListAPIView):
    queryset = models.Courses.objects.all()
    serializer_class = serializers.AllCoursesDetailsSerializer


#adding authentication to students
# views.py
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.response import Response

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def protected_view(request):
    return Response({'message': 'This is a protected view'})


class StudentLoginDetailsViewSet(viewsets.ModelViewSet):
    queryset = StudentLoginDetails.objects.all()
    serializer_class = serializers.StudentLoginObjectsReturnSerializer
    permission_classes = [IsAuthenticated]

class StudentAttendanceViewSet(viewsets.ModelViewSet):
    queryset = StudentAttendance.objects.all()
    serializer_class = serializers.AllStdsAttendanceserializer
    permission_classes = [IsAuthenticated]

class StudentWeeklyTestsViewSet(viewsets.ModelViewSet):
    queryset = StudentWeeklyTests.objects.all()
    serializer_class = serializers.StudentWeeklyTestsSerializeer
    permission_classes = [IsAuthenticated]

class StudentMockInterviewsViewSet(viewsets.ModelViewSet):
    queryset = StudentMockInterviews.objects.all()
    serializer_class = serializers.StudentMockTestPerformanceSerializer
    permission_classes = [IsAuthenticated]



@api_view(['GET'])
def get_student_performance(request,stdId):
    student = request.user
    print('sTUDENT',student)
    stdObj = models.StudentLoginDetails.objects.get(id=stdId)
    attendance = models.StudentAttendance.objects.filter(student=stdObj)
    weekly_tests = models.StudentWeeklyTests.objects.filter(student=stdObj)
    mock_interviews = serializers.StudentMockInterviews.objects.filter(student=stdObj)
    attendance_serializer = serializers.GetStudentAttendanceSerializer(attendance,many=True)
    weekly_tests_serializer = serializers.StudentWeeklyTestsSerializeer(weekly_tests, many=True)
    mock_interviews_serializer = serializers.StudentMockTestPerformanceSerializer(mock_interviews, many=True)
    print('attendance_serializer',attendance_serializer.data)
    print('weekly_tests',weekly_tests_serializer.data)
    print('mock_interviews_serializer',mock_interviews_serializer.data)
    return Response(data={
        'attendance':attendance_serializer.data,
        'weekly_tests': weekly_tests_serializer.data,
        'mock_interviews': mock_interviews_serializer.data
    })

class GalleryCategoriesView(APIView):
    def get(self, request, *args, **kwargs):
        categories = models.GalleryImagesTypes.objects.all()
        serializer = serializers.GalleryImagesTypeSerializer(categories, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)

class GalleryImagesView(APIView):
    def get(self, request, pk):
        category = models.GalleryImagesTypes.objects.get(pk=pk)
        images = category.galleryimages_set.all()
        serializer = serializers.GalleryImageSerializer(images, many=True)
        return Response(serializer.data,status=status.HTTP_200_OK)
    

class CourseListCreateView(generics.ListCreateAPIView):
    queryset = models.Courses.objects.all()
    serializer_class = serializers.AllCoursesDetailsSerializer

class CourseRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.Courses.objects.all()
    serializer_class = serializers.AllCoursesDetailsSerializer

class BatchListCreateView(generics.ListCreateAPIView):
    serializer_class = serializers.BatchDetailsSerializer

    def get_queryset(self):
        course_id = self.kwargs['course_id']
        return models.Batches.objects.filter(course_id=course_id)

class BatchRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.Batches.objects.all()
    serializer_class = serializers.BatchDetailsSerializer
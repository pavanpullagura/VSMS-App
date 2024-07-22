from django.shortcuts import render,get_object_or_404
from StaffApp import forms
from django.contrib import messages
from . import models
from .models import StaffDepartments,StaffDetails
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view,permission_classes
from rest_framework.permissions import IsAdminUser,IsAuthenticated
from . import serializers
from rest_framework import status
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from django.utils.crypto import get_random_string
from .serializers import StaffDepartmentsSerializer, StaffDetailsSerializer, UserSerializer,ChangePasswordSerializer,AdminUserSerializer,StaffDetailsSerializerForProfileInfo,AdminDetailsSerializer,StaffDepartmentsAlongWithStaffDetailsSerializer
from StaffApp.serializers import AllCoursesDetailsSerializer
from StaffApp.models import Courses
from rest_framework.views import APIView
from django.core.mail import send_mail
from django.conf import settings
from django.utils import timezone
from datetime import timedelta
from django.contrib.auth import authenticate
from .decorators import checkSuperUser

# Create your views here.



@api_view(['POST'])
def register_admin(request):
    data = request.data
    
    # Generate a random alphanumeric password
    password = get_random_string(length=8)
    
    try:
        # Create the user as a superuser
        
        user = User.objects.create_superuser(
            username=data['username'],
            email=data['email'],
            password=password,
            first_name=data['first_name'],
            last_name=data['last_name']
        )
        
        
        # Create the AdminDetails entry
        admin_details = models.AdminDetails.objects.create(
            user=user,
            first_name=user.first_name,
            last_name=user.last_name,
            username=data['username'],
            email=data['email'],
            contact_num=data['contact_num'],
            joining_date=data['joining_date'],
            gender=data['gender'],
            image=data.get('image', None)
        )

        # Optionally, send an email to the new admin with the password
        send_mail(
            'Your Admin Account',
            f'Your admin account has been created. Your password is: {password}',
            settings.DEFAULT_FROM_EMAIL,
            [data['email']],
            fail_silently=False,
        )
        
        return Response({'message': 'Admin registered successfully.'}, status=status.HTTP_201_CREATED)
    
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def adminLogin(request):
    print('request comes to view app for admin login')
    
    username = request.data.get('username')
    password = request.data.get('password')
    
    user = authenticate(username=username, password=password)
    
    if user is not None:
        if user.is_superuser:
            token, created = Token.objects.get_or_create(user=user)
            return Response(data={'token': token.key, 'usertype': "adminuser"}, status=status.HTTP_200_OK)
        else:
            return Response('You are not an authorized user', status=status.HTTP_401_UNAUTHORIZED)
    else:
        return Response('Invalid credentials', status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['POST'])
def adminLogout(request):
    print(request)
    try:
        request.user.auth_token.delete()
        return Response(status=status.HTTP_200_OK)
    except Exception as e:
        return Response(status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def adminProfile(request, uname):
    try:
        userRecord = models.AdminDetails.objects.filter(username=uname)
        seriali = AdminDetailsSerializer(userRecord, many=True, context={'request': request})
        print('MYOBJECT',seriali.data)
        return Response(data={"profileObj": seriali.data}, status=status.HTTP_200_OK)
    except models.AdminDetails.DoesNotExist:
        return Response({"detail": "User not found"}, status=status.HTTP_404_NOT_FOUND)
    
class AdminProfileUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, adminId):
        try:
            print('Admin id',adminId)
            adminObj = models.AdminDetails.objects.get(id=adminId)
            serializer = AdminDetailsSerializer(adminObj, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            print(serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except models.AdminDetails.DoesNotExist:
            return Response({'error': 'ADMIN not found'}, status=status.HTTP_404_NOT_FOUND)

class AdminProfilePictureUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, adminId):
        try:
            adminObj = models.AdminDetails.objects.get(id=adminId)
            if 'image' in request.FILES:
                adminObj.image = request.FILES['image']
                adminObj.save()
                return Response({'message': 'Profile picture updated successfully'}, status=status.HTTP_200_OK)
            else:
                print('image not provided')
                return Response({'error': 'No image provided'}, status=status.HTTP_400_BAD_REQUEST)
        except models.AdminDetails.DoesNotExist:
            return Response({'error': 'Staff not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

'''
@api_view(['POST'])
def adminLogin(request):
    print('request comes to view app for admin login')
    serializer = AdminUserSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data['user']
        print(user)
        print(user.is_super)
        if user.is_super:
            token, created = Token.objects.get_or_create(user=user)
            return Response(data={'token': token.key,'usertype':'adminuser'}, status=status.HTTP_200_OK)
        else:
            return Response('You are not an authorized user',status=status.HTTP_401_UNAUTHORIZED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    '''

class AddNewDepartment(APIView):
    def post(self,request):
        print(request.data)
        data = request.data
        dept_data = {
            'department_id': data['department_id'],
            'departmanet_name': data['departmanet_name']
        }
        deptObj = StaffDepartmentsSerializer(data=dept_data)
        print(deptObj)
        if deptObj.is_valid():
            deptObj.save()
            return Response(deptObj.data,status=status.HTTP_201_CREATED)
        return Response(deptObj.errors,status=status.HTTP_400_BAD_REQUEST)
        


class AddNewCourse(APIView):
    def post(self,request):
        print(request.data)
        data = request.data
        if data['course_image']:
            course_data = {
                'courseName': data['courseName'],
                'description': data['description'],
                'course_image': data['course_image']
            }
        else:
            course_data = {
                'courseName': data['courseName'],
                'description': data['description']
            }
        courseObj = AllCoursesDetailsSerializer(data=course_data)
        print(courseObj)
        if courseObj.is_valid():
            courseObj.save()
            return Response(courseObj.data,status=status.HTTP_201_CREATED)
        return Response(courseObj.errors,status=status.HTTP_400_BAD_REQUEST)

class StaffRegister(APIView):
    def post(self, request):
        data = request.data
        print("Received data:", data)  # Log the incoming data
        
        generated_password = get_random_string(8)
        user_data = {
            'username': data.get('username'),
            'email': data.get('email'),
            'password': generated_password,
            'is_staff': True
        }
        print("User data:", user_data)  # Log the data passed to the user serializer
        
        user_serializer = UserSerializer(data=user_data)
        if user_serializer.is_valid():
            user = user_serializer.save()
            staff_details_data = data.copy()
            staff_details_data['user'] = user.id
            staff_serializer = StaffDetailsSerializer(data=staff_details_data)

            if staff_serializer.is_valid():
                staff_serializer.save()
                send_mail(
                    'Your Staff Account Details',
                    f"Username: {user_data['username']}\nPassword: {user_data['password']}",
                    settings.DEFAULT_FROM_EMAIL,
                    ['pullagurapavankumar153@gmail.com'],
                )
                return Response({'message': 'Staff registered successfully'}, status=status.HTTP_201_CREATED)
            else:
                user.delete()
                return Response(staff_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            print("User Serializer Errors:", user_serializer.errors)  # Print user serializer errors
            return Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ForgotPassword(APIView):
    def post(self, request):
        username = request.data.get('username')
        email = request.data.get('email')
        try:
            user = User.objects.get(username=username, email=email)
            otp = get_random_string(6, '0123456789')
            if user.is_superuser:
                user.admindetails.otp = otp
                user.admindetails.otp_expiry = timezone.now() + timedelta(minutes=10)
                user.admindetails.save()
                send_mail(
                    'Your OTP',
                    f"Your OTP is {otp}",
                    settings.DEFAULT_FROM_EMAIL,
                    ['pullagurapavankumar153@gmail.com'],
                )
                return Response({'message': 'OTP sent'}, status=status.HTTP_200_OK)
                
            else:
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
            if user.is_superuser:
                admin_details = user.admindetails
                if admin_details.otp == otp and timezone.now() < admin_details.otp_expiry:
                    user.set_password(new_password)
                    user.save()
                    admin_details.password = new_password
                    admin_details.otp = None
                    admin_details.otp_expiry = None
                    admin_details.save()
                    return Response({'message': 'Password reset successfully'}, status=status.HTTP_200_OK)
                else:
                    return Response({'error': 'Invalid OTP or OTP expired'}, status=status.HTTP_400_BAD_REQUEST)
            else:
                
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
        
class ChangePasswordView(APIView):

    def post(self, request):
        user = request.user
        serializer = ChangePasswordSerializer(data=request.data, context={'user': user})

        if serializer.is_valid():
            user.set_password(serializer.validated_data['new_password'])
            user.save()
            return Response({'message': 'Password changed successfully'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    


class DepartmentList(APIView):
    def get(self, request):
        departments = StaffDepartments.objects.prefetch_related('staffdetails_set').all()
        serializer = StaffDepartmentsAlongWithStaffDetailsSerializer(departments, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class CourseList(APIView):
    def get(self, request):
        courses = models.Courses.objects.all()
        serializer = AllCoursesDetailsSerializer(courses, many=True)
        return Response(serializer.data)
    
@api_view(['GET'])
def KnowStaffDetailsByAdmin(request):
    staffData = StaffDetails.objects.all()
    serializerObj = StaffDetailsSerializerForProfileInfo(staffData, many=True)
    return Response(serializerObj.data, status=status.HTTP_200_OK)




@api_view(['POST'])
def register_staff(request):
    if request.method == 'POST':
        serializer = serializers.StaffSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        

def createStaffUser(request,data):
    if request.method == 'POST':
        newdata = {"user":data['username'],"username":data['username'],"email":data['email'],"password":data['password'],"is_staff":True}
        user_serializer = serializers.UserSerializer(data=newdata)
        print('userserializer',user_serializer)
        if user_serializer.is_valid():
            print('user_serializer is validated successfully')
            user = user_serializer.save()
            print('USER: ',user)
            token, created = Token.objects.get_or_create(user=user)
            messages.success(request, 'Data successfully inserted')
            return (token)
        else:
            print('user_serializer is validated successfully')
            messages.error(request, 'Error while validating data')
            return user_serializer.errors

@api_view(['POST'])
@permission_classes([IsAdminUser])
def register_staff(request):
    if request.method == 'POST':
        serializer = serializers.StaffSerializer(data=request.data)
        token = createStaffUser(request,request.data)
        if serializer.is_valid():
            serializer.save()
            messages.success(request,'DAta successfully inserted')
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            messages.error(request,'Error while validating data')

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    #unconfirmed_students = models.UnconfirmedStudents.objects.all()
    #serialObj = serializers.AskToRegisterSerializer(unconfirmed_students, many=True)
    #return Response(serialObj.data, status=status.HTTP_200_OK)
'''    '''
'''
@api_view(['GET','POST'])
def checkNewRegistrations(request):
    unConfirmedStdData = models.UnconfirmedStudents.objects.all()
    serialObj = serializers.AskToRegisterSerializer(unConfirmedStdData,many=True)
    if request.method=='POST':
        token = createStudentUser(request,request.data)
        print('token',token)
        confirmedStdObj = serializers.MakeRegisterSerializer(data=request.data)
        if confirmedStdObj.is_valid():
            print('object was valid:',confirmedStdObj)
            confirmedStdObj.save()
            confirmedStdObj.removeRecord(request.data)
            messages.success(request,'DAta successfully inserted')
            return Response(data={'token': token.key}, status=status.HTTP_201_CREATED)
        else:
            messages.error(request,'Error while validating data')
            print('confirmedStdObj has invalid data',confirmedStdObj)
            return Response(data={'token': token.key}, status=status.HTTP_200_OK)
    return Response(serialObj.data,status=status.HTTP_200_OK)'''


    


def staffRegistration(request):
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

    return render(request,'regStudent.html',{'form':emptyForm})


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






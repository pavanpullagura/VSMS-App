from django.shortcuts import render
from StaffApp import models
from StaffApp.models import StudentLoginDetails
from . import forms
from .serializers import StudentLoginDetailsSerializer,BatchSerializer,CourseSerializer,GetStudentProfileSerializer
from StaffApp import serializers
from django.contrib import messages
from rest_framework import status
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view,permission_classes,authentication_classes
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework import generics
from .serializers import CourseSerializer, BatchSerializer
from django.contrib.auth.tokens import default_token_generator
from rest_framework.permissions import IsAuthenticated,IsAdminUser
from rest_framework.decorators import permission_classes,parser_classes
from django.utils.crypto import get_random_string
from django.core.mail import send_mail
from django.conf import settings
from rest_framework.views import APIView
from django.utils import timezone
from datetime import timedelta
# Create your views here.

@csrf_exempt
@api_view(['POST'])
def getRegister(request):
    if request.method=='POST':
        serialObj = serializers.AskToRegisterSerializer(data=request.data)
        #dataForm = forms.GetStudentRegisterForm(request.POST,request.FILES)
        if serialObj.is_valid():
            serialObj.save()
            messages.success(request,'DAta successfully inserted')
            #return render(request,'registerStdbythemself.html',{'form':emptyForm})
            return Response(serialObj.data, status=status.HTTP_201_CREATED)
        return Response(serialObj.errors, status=status.HTTP_400_BAD_REQUEST)
            #return render(request,'registerStdbythemself.html',{'form':dataForm})
    #return render(request,'registerStdbythemself.html',{'form':emptyForm})

@api_view(['POST'])
#@permission_classes([IsAuthenticated])
def studentLogout(request):
    print(request)
    try:
        request.user.auth_token.delete()
        return Response(status=status.HTTP_200_OK)
    except Exception as e:
        return Response(status=status.HTTP_400_BAD_REQUEST)

class CourseList(generics.ListAPIView):
    queryset = models.Courses.objects.all()
    serializer_class = CourseSerializer

class BatchList(generics.ListAPIView):
    serializer_class = BatchSerializer

    def get_queryset(self):
        course_id = self.kwargs['course_id']
        return models.Batches.objects.filter(course_id=course_id)

#student login validation

@api_view(['POST'])
def studentAuthentication(request):
    serializer = serializers.StudentLoginSerializer(data=request.data)
    if serializer.is_valid():
        username = serializer.validated_data['username']
        password = serializer.validated_data['password']
        try:
            objs = User.objects.filter(username=username)
            if objs.exists():   
                student = objs.first()
                #student = User.objects.get(username=username)
                if student.check_password(password):
                    token, created = Token.objects.get_or_create(user=student)
                    stdObj = models.StudentLoginDetails.objects.filter(username=username).first()
                    stdObj_serialized = serializers.StudentLoginDetailsSerializer(stdObj)
                    print(stdObj_serialized.data)
                    return Response(data={"token": token.key, "stdObj": stdObj_serialized.data}, status=status.HTTP_200_OK)
                else:
                    return Response(data={"detail": "Invalid credentials"}, status=status.HTTP_203_NON_AUTHORITATIVE_INFORMATION)
            else:
                return Response(data={'detail':'Please provide valid username'},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except User.DoesNotExist:
            return Response(data={"detail": "User does not exist"}, status=status.HTTP_400_BAD_REQUEST)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ForgotPassword(APIView):
    def post(self, request):
        username = request.data.get('username')
        email = request.data.get('email')
        try:
            user = User.objects.get(username=username, email=email)
            otp = get_random_string(6, '0123456789')
            user.studentlogindetails.otp = otp
            user.studentlogindetails.otp_expiry = timezone.now() + timedelta(minutes=10)
            user.studentlogindetails.save()
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
            student_details = user.studentlogindetails
            if student_details.otp == otp and timezone.now() < student_details.otp_expiry:
                user.set_password(new_password)
                user.save()
                student_details.password = new_password
                student_details.otp = None
                student_details.otp_expiry = None
                student_details.save()
                return Response({'message': 'Password reset successfully'}, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'Invalid OTP or OTP expired'}, status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            return Response({'error': 'User does not exist'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_student_performance(request):
    student = request.user
    print('sTUDENT',student)
    stdObj = models.StudentLoginDetails.objects.get(username=student)
    weekly_tests = models.StudentWeeklyTests.objects.filter(student=stdObj)
    mock_interviews = serializers.StudentMockInterviews.objects.filter(student=stdObj)
    
    weekly_tests_serializer = serializers.StudentWeeklyTestsSerializeer(weekly_tests, many=True)
    mock_interviews_serializer = serializers.StudentMockTestPerformanceSerializer(mock_interviews, many=True)
    
    return Response({
        'weekly_tests': weekly_tests_serializer.data,
        'mock_interviews': mock_interviews_serializer.data
    })

#

@api_view(['GET'])
def studentUserProfile(request, uname):
    try:
        userRecord = models.StudentLoginDetails.objects.filter(username=uname)
        seriali = GetStudentProfileSerializer(userRecord, many=True, context={'request': request})
        print('MYOBJECT',seriali.data)
        return Response(data={"profileObj": seriali.data}, status=status.HTTP_200_OK)
    except models.StudentLoginDetails.DoesNotExist:
        return Response({"detail": "User not found"}, status=status.HTTP_404_NOT_FOUND)
'''
#@authentication_classes([TokenAuthentication])
#@permission_classes([IsAuthenticated])
@api_view(['POST'])
def studentAuthentication(request):
    serializer = serializers.StudentLoginSerializer(data=request.data)
    print(serializer)
    if serializer.is_valid():
        print('Data validated Successfuly')
        username = serializer.validated_data['username']
        print('username trail',username)
        #stdObj = models.StudentLoginDetails.objects.get(username=username)
        student = User.objects.get(username=username)
        # Generate or get the token
        token, created = Token.objects.get_or_create(user=student)
        
        return Response(data={"token": token.key}, status=status.HTTP_200_OK)
    print('Not validated')
    print(serializer.errors)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def studentUserProfile(request,uname):
    userRecord = models.StudentLoginDetails.objects.filter(username=uname)
    seriali = StudentLoginDetailsSerializer(userRecord,many=True)
    print('serilsdilf',seriali.data)
    return Response(data={"profileObj":seriali.data},status=status.HTTP_200_OK)
    #return Response(seriali.errors, status=status.HTTP_400_BAD_REQUEST)
'''
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
@api_view(['GET'])
def getAttendanceDetails(request,uname):
    try:
        studentObj = models.StudentLoginDetails.objects.get(username=uname)
        print(studentObj)
        attendance = models.StudentAttendance.objects.filter(student=studentObj)
        print(attendance)
        serializerObj = serializers.GetStudentAttendanceSerializer(attendance,many=True)
        print(serializerObj.data)
        return Response(serializerObj.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": "Student not found"}, status=status.HTTP_404_NOT_FOUND)
@api_view(['GET', 'POST'])
def getStudentAttendance(request, stdid):
    try:
        stdObj = models.StudentLoginDetails.objects.get(id=stdid)
    except models.StudentLoginDetails.DoesNotExist:
        return Response({'error': 'Student not found'}, status=status.HTTP_404_NOT_FOUND)

    attendance = models.StudentAttendance.objects.filter(student=stdObj)
    serializedAttendance = serializers.GetStudentAttendanceSerializer(attendance, many=True)
    return Response(serializedAttendance.data, status=status.HTTP_200_OK)

@api_view(['GET','POST'])
def getStudentId(request):
    uname = request.data['username']
    stdObj = models.StudentLoginDetails.objects.filter(username=uname)
    #print(stdObj)
    serializeObj = serializers.StudentLoginDetailsSerializer(stdObj,many=True)
    #print(serializeObj)
    return Response(serializeObj.data,status=status.HTTP_200_OK)

   
@api_view(['POST'])
def reset_password(request):
    email = request.data.get('email')
    try:
        user = User.objects.get(email=email)
        token = default_token_generator.make_token(user)
        reset_url = f"http://localhost:3000/reset-password-confirm/{user.pk}/{token}/"

        send_mail(
            'Password Reset Request',
            f'Click the link to reset your password: {reset_url}',
            settings.DEFAULT_FROM_EMAIL,
            ['pullagurapavankumr153@gmail.com'],
        )

        return Response({'message': 'Password reset email sent.'}, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response({'error': 'User with this email does not exist.'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def reset_password_confirm(request, uidb64, token):
    new_password = request.data.get('new_password')
    try:
        user = User.objects.get(pk=uidb64)
        if default_token_generator.check_token(user, token):
            user.set_password(new_password)
            user.save()
            return Response({'message': 'Password has been reset.'}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Invalid token.'}, status=status.HTTP_400_BAD_REQUEST)
    except User.DoesNotExist:
        return Response({'error': 'Invalid user ID.'}, status=status.HTTP_400_BAD_REQUEST)
    

class StudentMonthlyAttendanceView(APIView):
    #permission_classes = [IsAuthenticated]

    def get(self, request, student_id, year=None, month=None):
        try:
            student = models.StudentLoginDetails.objects.get(id=student_id)
        except models.StudentLoginDetails.DoesNotExist:
            return Response({"detail": "Student not found"}, status=status.HTTP_404_NOT_FOUND)

        today = timezone.now().date()
        
        if year is None or month is None:
            year = today.year
            month = today.month

        attendance_records = models.StudentAttendance.objects.filter(
            student=student
        ).order_by('date')
        print(attendance_records)

        serialized_attendance = serializers.GetStudentAttendanceSerializer(attendance_records, many=True)
        print(serialized_attendance)
        return Response({
            'student': serializers.StudentLoginDetailsSerializer(student).data,
            'attendance': serialized_attendance.data
        })

class StudentMonthlyAttendanceByDateView(APIView):
    def get(self, request, student_id, year, month):
        student = models.StudentLoginDetails.objects.get(id=student_id)
        today = timezone.now().date()
        
        

        attendance_records = models.StudentAttendance.objects.filter(
            student=student,
            date__year=year,
            date__month=month
        ).order_by('date')

        serialized_attendance = serializers.GetStudentAttendanceSerializer(attendance_records, many=True)
        print(serialized_attendance)
        return Response({
            'student': serializers.StudentLoginDetailsSerializer(student).data,
            'attendance': serialized_attendance.data
        })


class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user = request.user
        current_password = request.data.get("current_password")
        new_password = request.data.get("new_password")
        if not user.check_password(current_password):
            return Response({"current_password": ["Wrong password."]}, status=status.HTTP_400_BAD_REQUEST)
        user.set_password(new_password)
        user.save()
        table_user = models.StudentLoginDetails.objects.get(username=user)
        table_user.password = new_password
        table_user.confirm_password = new_password
        table_user.save()
        return Response({"detail": "Password changed successfully."})
    
class StudentProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, student_id):
        try:
            student = models.StudentLoginDetails.objects.get(id=student_id)
            stdSerializer = serializers.StudentLoginObjectsReturnSerializer(student)
            return Response(stdSerializer.data)
        except models.StudentLoginDetails.DoesNotExist:
            return Response({'error': 'Staff not found'}, status=status.HTTP_404_NOT_FOUND)

    def put(self, request, student_id):
        try:
            std = models.StudentLoginDetails.objects.get(id=student_id)
            serializer = serializers.StudentLoginObjectsReturnSerializer(std, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            print(serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except models.StudentLoginDetails.DoesNotExist:
            return Response({'error': 'Staff not found'}, status=status.HTTP_404_NOT_FOUND)

class StudentProfilePictureUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, student_id):
        try:
            std = models.StudentLoginDetails.objects.get(id=student_id)
            if 'image' in request.FILES:
                std.image = request.FILES['image']
                std.save()
                return Response({'message': 'Profile picture updated successfully'}, status=status.HTTP_200_OK)
            else:
                print('image not provided')
                return Response({'error': 'No image provided'}, status=status.HTTP_400_BAD_REQUEST)
        except models.StudentLoginDetails.DoesNotExist:
            return Response({'error': 'Staff not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
'''
class StudentCoursesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, student_id):
        student = models.StudentLoginDetails.objects.get(id=student_id)
        courses = student.course_details.all()
        serialized_courses = serializers.AllCoursesDetailsSerializer(courses, many=True)
        return Response(serialized_courses.data)
'''

class StudentCoursesView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = serializers.AllCoursesDetailsSerializer

    def get(self, request, student_id):
        try:
            student = StudentLoginDetails.objects.get(id=student_id)
            course = student.course_details
            if course:
                serializeObj = serializers.AllCoursesDetailsSerializer(course)
                return Response(data=serializeObj.data, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'No course found for this student'}, status=status.HTTP_404_NOT_FOUND)
        except StudentLoginDetails.DoesNotExist:
            return Response({'error': 'Student not found'}, status=status.HTTP_404_NOT_FOUND)
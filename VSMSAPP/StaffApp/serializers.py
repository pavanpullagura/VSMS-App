from rest_framework import serializers
from . import models
from AdminApp.models import StaffDetails
from StaffApp.models import Batches,Courses,StudentLoginDetails,StudentAttendance,StudentMockInterviews,StudentWeeklyTests,ContactedPersonsDetails,NewEnrolledStudentsModel,StudentFeeDetails
from django.contrib.auth.hashers import check_password  # For checking hashed passwords
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token


# serializers.py
class GetStaffProfileSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = StaffDetails
        exclude = ('password', 'confirm_password', 'otp', 'otp_expiry')

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.request = self.context.get('request')
        print('Checking the reqeust',self.request)

    def get_image(self, obj):
        if obj.image:
            print('image url',self.request.build_absolute_uri(obj.image.url))
            return self.request.build_absolute_uri(obj.image.url)
        return None

class MakeRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model= models.StudentLoginDetails
        fields = '__all__'
    def removeRecord(self,data):
        rec = models.UnconfirmedStudents.objects.get(username=data['username'])
        rec.delete()


class AskToRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model= models.UnconfirmedStudents
        fields = ['id','studentFullName','username','contact_num','email','joining_date','course_details','batch_details','image']




class UserSerializer(serializers.ModelSerializer):
    #password1 = serializers.CharField(write_only=True, max_length=20)
    #password2 = serializers.CharField(write_only=True, max_length=20)

    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        Token.objects.create(user=user)
        return user
    
'''
class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Profile
        fields = ['user', 'user_type', 'studentFullName', 'contact_num', 'joining_date', 'course_details', 'batch_details', 'profile_image']

    def create(self, validated_data):
        profile = models.Profile.objects.create(**validated_data)
        return profile

    def update(self, instance, validated_data):
        instance.user_type = validated_data.get('user_type', instance.user_type)
        instance.studentFullName = validated_data.get('studentFullName', instance.studentFullName)
        instance.contact_num = validated_data.get('contact_num', instance.contact_num)
        instance.joining_date = validated_data.get('joining_date', instance.joining_date)
        instance.course_details = validated_data.get('course_details', instance.course_details)
        instance.batch_details = validated_data.get('batch_details', instance.batch_details)
        instance.profile_image = validated_data.get('profile_image', instance.profile_image)
        instance.save()
        return instance
    '''

class AllCoursesDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model=models.Courses
        fields = '__all__'

class BatchDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Batches
        fields = '__all__'

class StudentLoginDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model= models.StudentLoginDetails
        fields = '__all__'

    def update(self, instance, validated_data):
        instance.studentFullName = validated_data.get('studentFullName', instance.studentFullName)
        instance.contact_num = validated_data.get('contact_num', instance.contact_num)
        instance.joining_date = validated_data.get('joining_date', instance.joining_date)
        instance.course_details = validated_data.get('course_details', instance.course_details)
        instance.batch_details = validated_data.get('batch_details', instance.batch_details)
        instance.image = validated_data.get('profile_image', instance.image)
        if 'password' in validated_data:
            instance.set_password(validated_data['password'])
        instance.save()
        print('INSTANCE IN SERIALIZER',instance)
        return instance

class GetStudentAttendanceSerializer(serializers.ModelSerializer):
    class Meta:
        model= models.StudentAttendance
        fields = '__all__'

class AllStdsAttendanceserializer(serializers.ModelSerializer):
    class Meta:
        model= models.StudentAttendance
        fields = '__all__'

class StudentLoginObjectsReturnSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.StudentLoginDetails
        fields = '__all__'

class StudentFeeDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentFeeDetails
        fields =  ['total_fee', 'paid_amount', 'pending_amount', 'payment_date']

class StudentSerializer(serializers.ModelSerializer):
    courses = AllCoursesDetailsSerializer(many=True, read_only=True)

    class Meta:
        model = StudentLoginDetails
        fields = ['id', 'studentFullName', 'email', 'course_details']




class StudentWeeklyTestsSerializeer(serializers.ModelSerializer):
    class Meta:
        model = StudentWeeklyTests
        fields = '__all__'

class StudentMockTestPerformanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentMockInterviews
        fields = '__all__'


'''
class UserSerializer(serializers.Serializer):
    username = serializers.CharField(max_length = 20)
    email = serializers.EmailField()
    password1 = serializers.CharField(max_length=20)
    password2 = serializers.CharField(max_length=20)

    def validate(self,data):
        if data['password1']!=data['password2']:
            raise serializers.ValidationError('password mismatch')
        return data
    
    def createuser(self,userdata):
        userObj = User.objects.create(username=userdata['username'],email=userdata['email'])
        userObj.set_password(userdata['password1'])
        userObj.save()

        user_token = Token.objects.create(user=userObj)
        return user_token
'''
class StudentLoginSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=20)
    password = serializers.CharField(max_length=50)

    def validate(self, data):
        uname = data['username']
        pwd = data['password']
        if uname and pwd:
            student = User.objects.get(username=uname)
            '''
            try:
                print(uname,pwd)
                student = User.objects.get(username=uname)
                print(student)
            except student.DoesNotExist:
                print('inside except')
                raise serializers.ValidationError("Invalid username or password")
                '''

            if not student.check_password(pwd):
                print('inside checking password')  # Compare the hashed password
                raise serializers.ValidationError("Invalid username or password")
        else:
            raise serializers.ValidationError("Must include both username and password")

        print(data)
        return data
    
        '''
        std = models.User.objects.get(username=uname)
        print(std.password)
        if std.password != pwd:  # Simple comparison if not hashed
            raise serializers.ValidationError("Invalid username or password")

        return data
        '''
    '''
        try:
            student = models.StudentLoginDetails.objects.get(username=uname)
        except models.StudentLoginDetails.DoesNotExist:
            raise serializers.ValidationError("Invalid username or password")
            '''

        # If you are using hashed passwords, use check_password
        # if not check_password(password, student.password):
        

class ContactedPersonsDetailsSerializer(serializers.ModelSerializer):
     class Meta:
        model = ContactedPersonsDetails
        fields = ['name', 'email', 'contact_num', 'message']

class EnrollSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewEnrolledStudentsModel
        fields = '__all__'

class GalleryImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = models.GalleryImages
        fields = ['id', 'image', 'image_url', 'description']

    def get_image_url(self, obj):
        request = self.context.get('request')
        if request is not None and obj.image:
            return request.build_absolute_uri(obj.image.url)
        return None

class GalleryImagesTypeSerializer(serializers.ModelSerializer):
    galleryimages_set = GalleryImageSerializer(many=True, read_only=True)

    class Meta:
        model = models.GalleryImagesTypes
        fields = ['id', 'category_name', 'category_description', 'galleryimages_set']

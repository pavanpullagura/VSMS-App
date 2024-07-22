from rest_framework import serializers
from .models import StaffDepartments,StaffDetails,AdminDetails
from django.contrib.auth.hashers import check_password  # For checking hashed passwords
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
# serializers.py



class AdminDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdminDetails
        fields = '__all__'

class AdminUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'password', 'email']

    def create(self, validated_data):
        user = User.objects.create_superuser(**validated_data)
        return user
    
# for returning staff data along with departments i am adding these two serializers
class StaffDetailsforReturningAlongWithDeptsSerializer(serializers.ModelSerializer):
    class Meta:
        model = StaffDetails
        fields = ['first_name', 'last_name', 'contact_num', 'email', 'address','image']

class StaffDepartmentsAlongWithStaffDetailsSerializer(serializers.ModelSerializer):
    staff = StaffDetailsforReturningAlongWithDeptsSerializer(many=True, read_only=True, source='staffdetails_set')

    class Meta:
        model = StaffDepartments
        fields = ['department_id', 'departmanet_name', 'staff']

class StaffDepartmentsSerializer(serializers.ModelSerializer):
    class Meta:
        model = StaffDepartments
        fields = '__all__'

class StaffDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = StaffDetails
        exclude = ('password', 'confirm_password', 'otp', 'otp_expiry') 

class StaffDetailsSerializerForProfileInfo(serializers.ModelSerializer):
    department_name = serializers.SerializerMethodField()

    class Meta:
        model = StaffDetails
        fields = ['id', 'first_name', 'last_name', 'email', 'contact_num', 'image', 'qualification', 'address', 'department_name']

    def get_department_name(self, obj):
        return obj.department.departmanet_name


class UserSerializer(serializers.ModelSerializer):
    print('userserinalizrekjbh v=callled')
    password = serializers.CharField(write_only=True)
    print('userserinalizre v=callled')

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'is_staff')

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            is_staff=validated_data['is_staff']
        )
        return user
    
class AdminUserSerializer(serializers.ModelSerializer):
    class Meta:
        model=User
        fields=['username','email','password','is_superuser']

    
class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)

    def validate(self, attrs):
        user = self.context['user']
        if not user.check_password(attrs['old_password']):
            raise serializers.ValidationError({'old_password': 'Old password is incorrect'})
        return attrs


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'email']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        user.is_staff = True
        user.save()
        Token.objects.create(user=user)
        return user

class StaffSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = StaffDetails
        fields = ['user', 'FullName', 'contact_num', 'joining_date', 'qualification', 'department', 'course', 'image']

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        user = UserSerializer.create(UserSerializer(), validated_data=user_data)
        staff = StaffDetails.objects.create(user=user, **validated_data)
        return staff


class StaffLoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        username = data.get('username')
        password = data.get('password')

        if username and password:
            user = authenticate(username=username, password=password)
            if user:
                if not user.is_active:
                    raise serializers.ValidationError("User is deactivated.")
                data['user'] = user
            else:
                raise serializers.ValidationError("Unable to log in with provided credentials.")
        else:
            raise serializers.ValidationError("Must include 'username' and 'password'.")

        return data


class StaffLoginSerializer2(serializers.Serializer):
    username = serializers.CharField(max_length=20)
    password = serializers.CharField(max_length=50)

    def validate(self, data):
        uname = data['username']
        pwd = data['password']
        if uname and pwd:
            try:
                print(uname,pwd)
                staff = User.objects.get(username=uname)
                print(staff)
            except staff.DoesNotExist:
                print('inside except')
                raise serializers.ValidationError("Invalid username or password")

            if not staff.check_password(pwd):
                print('inside checking password')  # Compare the hashed password
                raise serializers.ValidationError("Invalid username or password")
        else:
            raise serializers.ValidationError("Must include both username and password")

        print(data)
        return data
    
from django.contrib.auth.models import User
from rest_framework import serializers
'''
class UserSerializer(serializers.ModelSerializer):
    #password1 = serializers.CharField(write_only=True, max_length=20)
    #password2 = serializers.CharField(write_only=True, max_length=20)

    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        Token.objects.create(user=user)
        return user'''
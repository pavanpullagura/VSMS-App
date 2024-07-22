# serializers.py
from rest_framework import serializers
from StaffApp.models import Courses, Batches, StudentLoginDetails

class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Courses
        fields = ['id', 'courseName']

class BatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Batches
        fields = ['id', 'Batch_name', 'course']

class StudentLoginDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentLoginDetails
        fields = '__all__'

# serializers.py


class GetStudentProfileSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = StudentLoginDetails
        fields = ['id', 'studentFullName', 'username', 'email', 'contact_num', 'joining_date', 'password', 'confirm_password', 'course_details', 'batch_details', 'image']

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.request = self.context.get('request')
        print('Checking the reqeust',self.request)

    def get_image(self, obj):
        if obj.image:
            print('image url',self.request.build_absolute_uri(obj.image.url))
            return self.request.build_absolute_uri(obj.image.url)
        return None

    '''
    def getRecord(self,data):
        user = StudentLoginDetails.objects.get(username=data['uname'])
        print('inside serializer got an object',user)
        return user
    '''


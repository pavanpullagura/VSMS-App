# Generated by Django 5.0.3 on 2024-07-07 12:37

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Courses',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('courseName', models.CharField(max_length=40)),
                ('description', models.TextField(blank=True, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='UnconfirmedStudents',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('studentFullName', models.CharField(max_length=100)),
                ('username', models.CharField(max_length=20)),
                ('email', models.EmailField(max_length=254)),
                ('contact_num', models.BigIntegerField()),
                ('joining_date', models.DateField()),
                ('password', models.CharField(max_length=50)),
                ('confirm_password', models.CharField(max_length=50)),
                ('course_details', models.CharField(max_length=50)),
                ('batch_details', models.CharField(max_length=50)),
                ('image', models.ImageField(null=True, upload_to='images/')),
            ],
        ),
        migrations.CreateModel(
            name='Batches',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('Batch_name', models.CharField(max_length=50)),
                ('course', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='StaffApp.courses')),
            ],
        ),
        migrations.CreateModel(
            name='StudentLoginDetails',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('studentFullName', models.CharField(blank=True, max_length=100, null=True)),
                ('username', models.CharField(max_length=20)),
                ('email', models.EmailField(max_length=254)),
                ('contact_num', models.BigIntegerField(blank=True, null=True)),
                ('joining_date', models.DateField(blank=True, null=True)),
                ('password', models.CharField(max_length=50)),
                ('confirm_password', models.CharField(max_length=50)),
                ('image', models.ImageField(blank=True, null=True, upload_to='images/')),
                ('otp', models.CharField(blank=True, max_length=6, null=True)),
                ('otp_expiry', models.DateTimeField(blank=True, null=True)),
                ('batch_details', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='StaffApp.batches')),
                ('course_details', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='StaffApp.courses')),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='StudentAttendance',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField()),
                ('status', models.CharField(max_length=20)),
                ('student', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='StaffApp.studentlogindetails')),
            ],
        ),
        migrations.CreateModel(
            name='StudentMockInterviews',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('interview_date', models.DateField()),
                ('obtained_score', models.FloatField()),
                ('total_score', models.IntegerField()),
                ('student', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='StaffApp.studentlogindetails')),
            ],
        ),
        migrations.CreateModel(
            name='StudentWeeklyTests',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('test_date', models.DateField()),
                ('obtained_marks', models.IntegerField()),
                ('total_marks', models.IntegerField()),
                ('student', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='StaffApp.studentlogindetails')),
            ],
        ),
    ]

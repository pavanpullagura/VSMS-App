# Generated by Django 5.0.3 on 2024-07-12 04:19

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('StaffApp', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='NewEnrolledStudentsModel',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('studentFirstName', models.CharField(max_length=100)),
                ('studentLastName', models.CharField(max_length=100)),
                ('dateOfBirth', models.DateField()),
                ('graduation', models.CharField(choices=[('B.Tech', 'B.Tech'), ('B.E', 'B.E'), ('B.Sc', 'B.Sc'), ('B.Com', 'B.Com'), ('B.A', 'B.A')], max_length=20)),
                ('specialization', models.CharField(max_length=100)),
                ('passedOutYear', models.IntegerField()),
                ('address', models.TextField()),
                ('gender', models.CharField(choices=[('Male', 'Male'), ('Female', 'Female'), ('Other', 'Other')], max_length=10)),
                ('email', models.EmailField(max_length=254)),
                ('contact_num', models.CharField(max_length=15)),
                ('joiningMonthPreference', models.CharField(choices=[('this month', 'This Month'), ('next month', 'Next Month'), ('after 1 month', 'After 1 Month'), ('after 2 months', 'After 2 Months')], max_length=20)),
                ('selectCourse', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='StaffApp.courses')),
            ],
        ),
    ]

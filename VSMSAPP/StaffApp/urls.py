from django.urls import path,include
from rest_framework.routers import DefaultRouter
from . import views
# urls.py

'''
router = DefaultRouter()
router.register(r'batches', views.BatchViewSet.as_view(),basename='batches')
router.register(r'students', views.StudentViewSet,basename='students')
'''

router = DefaultRouter()
router.register(r'studentattendance',views. StudentAttendanceViewSet)
router.register(r'studenttests', views.StudentWeeklyTestsViewSet)
router.register(r'studentmockinterviews', views.StudentMockInterviewsViewSet)


urlpatterns = [
    #path('', include(router.urls)),
    path('', include(router.urls)),
    path('login/',views.staffLogin,name='staffloginurl'),
    path('logout/', views.staffLogout, name='logout'),
    path('profile/<str:uname>/',views.staffUserProfile, name='user-profile'),
    path('profileinfo/<int:staffId>/',views.StaffProfileView.as_view(), name='student-profile'),
    path('profile-picture/<int:staffId>/',views.StaffProfilePictureUpdateView.as_view(), name='profile-picture-update'),
    path('addcourse/',views.addNewCourse),
    path('addbatch/',views.AddNewBatch.as_view()),
    #path('addbatch/',views.addnewBatch),
    path('registerstudent/', views.studentRegistration),
    path('unconfirmed-students/', views.UnconfirmedStudentsList.as_view(), name='unconfirmed-students-list'),
    path('confirm-registration/<int:pk>/', views.ConfirmRegistration.as_view(), name='confirm-registration'),
    path('decline-registration/<int:pk>/', views.DeclineRegistration.as_view(), name='decline-registration'),
    path('forgot-password/',views.ForgotPassword.as_view(), name='forgot-password'),
    path('reset-password/',views.ResetPassword.as_view(), name='reset-password'),

    path('checknewentries/',views.checkNewRegistrations),
    #path('allstudents/', views.studentDetails),
    #path('allcourses/', views.allCourses),
    path('allcourses/', views.allCourses),
    path('courses/<int:pk>/batches', views.allBatches),
    path('allbatches/', views.BatchViewSet.as_view()),
    path('batches/<int:cid>/<int:bid>/',views.allStudentsInBatch),
    path('api/students/attendance/<int:year>/<int:month>/', views.AllStudentMonthlyAttendanceView.as_view(), name='student-monthly-attendance'),
    path('addattendance/<int:stdno>/',views.addStudentAttendance),
    path('allstdsattendance/',views.allStudentsAttendance),
    path('addweeklytest/<int:stdno>/',views.addStudentWeeklyTest),
    path('students/',views.studentsList, name='student-list'),
    #path('attendance/<int:student_id>/', views.StudentAttendanceList.as_view(), name='student-attendance-list'),
    #path('attendance/<int:batch_id>/', views.StudentAttendanceList.as_view(), name='student-attendance-list'),
    path('attendance/<int:batch_id>/',views.StudentAttendanceList.as_view(), name='student-attendance-list'),
    path('attendance/<int:batch_id>/add/',views.AddAttendanceView.as_view()),
    path('weekly-tests/<int:batch_id>/',views.StudentWeeklyTestsList.as_view(), name='student-weekly-tests-list'),
    path('profile-picture-upload/',views.update_profile_picture, name='update_profile_picture'),

    path('search_students/', views.search_students, name='search_students'),
    path('student_reports/<int:student_id>/', views.fetch_student_reports, name='fetch_student_reports'),
    path('submit_weekly_test/', views.submit_weekly_test, name='submit_weekly_test'),
    path('submit_mock_interview/', views.submit_mock_interview, name='submit_mock_interview'),

    path('getallstudents/',views.get_allStudents),
    path('allstudents/',views.get_all_students),
    path('allstudents/<int:pk>/fee_details/', views.fee_details, name='fee-details'),
    path('allstudents/<int:student_id>/average_attendance/', views.get_student_average_attendance, name='get_student_average_attendance'),
    path('allstudents/<int:student_id>/average_mock_performance/', views.get_student_average_mock_performance, name='get_student_average_mock_performance'),
    path('allstudents/<int:student_id>/average_weekly_tests/', views.get_student_average_weekly_tests, name='get_student_average_weekly_tests'),
    path('allstudents/<int:student_id>/add_fee_detail/', views.add_fee_detail, name='add_fee_detail'),
    path('allstudents/<int:student_id>/modify_fee_status/', views.modify_student_fee_status, name='modify_student_fee_status'),

    path('student_weekly_tests/<str:stduname>/', views.get_student_performance2, name='get_all_weekly_tests'),
    path('student_mock_interviews/<str:stduname>/',views.get_student_mock_interviews, name='get_all_mock_interviews'),
    path('weekly_test_reports/<int:student_id>/', views.get_weekly_test_report, name='get_weekly_test_report'),
    path('mock_interview_reports/<int:student_id>/', views.get_mock_interview_report, name='get_mock_interview_report'),
    path('update_weekly_test/<int:report_id>/', views.update_weekly_test, name='update_weekly_test'),
    path('update_mock_interview/<int:report_id>/', views.update_mock_interview, name='update_mock_interview'),
    path('contact-us/', views.contact_us, name='contact_us'),
    path('contacted-persons-details/', views.contacted_persons_details),
    path('delete_message/<str:email>/', views.deleteContactedMessage),
    path('enrollments/', views.EnrollListCreateView.as_view(), name='enrollment-list-create'),
    path('enrollments/<int:pk>/', views.EnrollListCreateView.as_view(), name='enrollment-delete'),
    path('courses/', views.CourseListView.as_view(), name='course-list'),

    path('eachstdperformance/<int:stdId>/',views.get_student_performance,name='get_each_student_performance'),
    path('gallery-categories/', views.GalleryCategoriesView.as_view()),
    path('gallery-images/<int:pk>/', views.GalleryImagesView.as_view()),

    
    path('createcourses/', views.CourseListCreateView.as_view(), name='course-list-create'),
    path('courses/<int:pk>/', views.CourseRetrieveUpdateDestroyView.as_view(), name='course-retrieve-update-destroy'),
    path('courses/<int:course_id>/batches/', views.BatchListCreateView.as_view(), name='batch-list-create'),
    path('batches/<int:pk>/', views.BatchRetrieveUpdateDestroyView.as_view(), name='batch-retrieve-update-destroy'),
    #path('studentlogindetails/', views.StudentLoginDetailsViewSet.as_view(), name='students-list'),
    #path('studentattendance/', views.StudentAttendanceViewSet.as_view(), name='attendance-list'),
    #path('studenttests/', views.StudentWeeklyTestsViewSet.as_view(), name='tests-list'),
    #path('studentmockinterviews/', views.StudentMockInterviewsViewSet.as_view(), name='mocks-list'),

    
]



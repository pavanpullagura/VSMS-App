from django.urls import path
from . import views

urlpatterns=[
    path('register/',views.getRegister),
    path('login/',views.studentAuthentication),
    path('forgotpassword/',views.ForgotPassword.as_view(), name='forgot-password'),
    path('reset-password/',views.ResetPassword.as_view(), name='reset-password'),
    path('logout/',views.studentLogout),
    path('getid/',views.getStudentId),
    path('monthlyattendance/<str:uname>/',views.getAttendanceDetails),
    path('profile/<str:uname>/',views.studentUserProfile, name='user-profile'),
    #path('attendance/<int:stdid>/',views.getStudentAttendance),
    path('courses/', views.CourseList.as_view(), name='course-list'),
    path('batches/<int:course_id>/', views.BatchList.as_view(), name='batch-list'),
    path('reset-password/',views.reset_password, name='reset_password'),
    path('reset-password-confirm/<uidb64>/<token>/',views.reset_password_confirm, name='reset_password_confirm'),
    path('attendance/<int:student_id>/',views.StudentMonthlyAttendanceView.as_view(), name='student-attendance'),
    path('attendance/<int:student_id>/<int:year>/<int:month>/',views.StudentMonthlyAttendanceByDateView.as_view()),
    path('performance/', views.get_student_performance, name='get_student_performance'),
    path('change-password/', views.ChangePasswordView.as_view(), name='change-password'),
    path('profileinfo/<int:student_id>/',views.StudentProfileView.as_view(), name='student-profile'),
    path('profile-picture/<int:student_id>/',views.StudentProfilePictureUpdateView.as_view(), name='profile-picture-update'),
    #path('courses/<int:student_id>/',views.StudentCoursesView.as_view(), name='student-courses'),
    path('<int:student_id>/courses/', views.StudentCoursesView.as_view(), name='student-courses'),
]
from django.urls import path
from . import views

urlpatterns=[
    path('register-admin/', views.register_admin, name='register_admin'),
    path('login/',views.adminLogin),
    path('logout/',views.adminLogout),
    path('profile/<str:uname>/',views.adminProfile, name='user-profile'),
    path('profileupdate/<int:adminId>/',views.AdminProfileUpdateView.as_view(), name='user-profile'),
    path('profilepictureupdate/<int:adminId>/',views.AdminProfilePictureUpdateView.as_view(), name='user-profile'),
    path('createdept/',views.AddNewDepartment.as_view()),
    path('addnewcourse/',views.AddNewCourse.as_view()),
    path('registerstaff/',views.register_staff),
    path('getstaffdetails/',views.KnowStaffDetailsByAdmin, name='knowstaffdetails'),
    path('register/',views.StaffRegister.as_view(), name='staff-register'),
    path('forgotpassword/',views.ForgotPassword.as_view(), name='forgot-password'),
    path('reset-password/',views.ResetPassword.as_view(), name='reset-password'),
    path('change-password/',views.ChangePasswordView.as_view(), name='change-password'),
    path('departments/',views.DepartmentList.as_view(), name='department-list'),
    path('courses/',views.CourseList.as_view(), name='course-list'),
]
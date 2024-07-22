import { useState,createContext } from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router,Link,Routes,Route,Navigate } from 'react-router-dom';
import axios from 'axios';
//import Home from './Home';
import { Carousel } from './mainpagecomponents/Courousel';
import Loginlinks from './Loginlinks';
import ProtectedRoute from './ProtectedRouteComponent';
import StudentLogin from './Studentlogin';
import ManagementLogin from './ManagementLogin';
import StudentDashboard from './StudentDashboard';
import StaffDashboard from './StaffDashboard';
import StudentSelfAttendance from './KnowStdSelfAttendance';
//import Logout from './LogoutUsage';
import StaffDashboardNav from './StaffDashboardNav';
import ContactedPersonsDetails from './OfficeExecutivesDashboard';
import StaffPythonDash from './StaffPythonDash';
import RegisterStudent from './RegisterStudent';
import LoginStudent from './LoginforStudent';
import LoginStaff from './LoginforStaff';
import Dashboard from './Dashboard';
import BatchDetails from './Batches';
//import Students from './Student';
import CoursesComponent from './CoursesComponent';
//import KnowStdAttendanceByStaff from './KnowStudentAttendanceByStaff';
//import StudentAttendance from './StudentAttendance';
import KnowStudentAttendanceByStaff from './KnowStudentAttendanceByStaff';
import AddStudentAttendanceByStaff from './AddStudentAttendanceByStaff';
//import Navbar from './components/Navbar';
import Sidebar from './Sidebar';
import CheckNewRegistrations from './CheckNewStdRegistrations';
import RegisterNewStudentByStaff from './RegisterNewStudentByStaff';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Courses from './components/Courses';
import SelfAttendance from './components/StdSelfAttendance';
import Performance from './components/Performance';
import Profile from './components/StdProfileOverlay';
import Login from './components/Login';
import PasswordReset from './components/PasswordReset';
import PasswordResetConfirm from './components/PasswordResetConfirm';
import Logout from './Logout';
import StdLogout from './StudentLogout';
import DefaultNavbar from './components/DefaultNavbar';
//import RegisterStaff from './components/staff/RegisterStaff';
import AddNewStaffByAdmin from './components/AddNewStaffByAdmin';
import AddNewCourse from './components/AddNewCourse';
import AddNewDepartment from './components/AddNewDepartment';
import ForgotPasswordForStaff from './components/StaffForgotPassword';
import StudentForgotPassword from './components/StudentForgotPassword';
import ChangePassword from './components/ChangePassword';
import LoginAdmin from './components/LoginForAdmin';
import StudentAttendanceTable from './components/StudentsAttendanceTable';
import SearchAndSubmitTest from './components/SearchAndSubmitTestReports';
import StudentSelfPerformance from './components/StudentSelfPerformance';
import StudentSelfPerformanceInChart from './KnowStdSelfPerformanceInChart';
import ProfileOverlay from './components/StdProfileOverlay';
import OtherStaff from './components/OtherStaff';

//import AllStudentPerformance from './components/AllStudentsPerformance';
import MockInterviewsTable from './components/AllStudentsMockPerformanceReports';
import WeeklyTestsTable from './components/AllStudentsWeeklyTestsReports';
import AllStudentsTable from './components/AllStudentsDetails';
import StudentMockInterviews from './components/StudentMockPerformance';
import StudentWeeklyTests from './components/StudentWeeklyPerformance';
import StaffNewDashboard from './components/staff/StaffNewDashboard';


import AdminDashbord from './components/AdminDashboard';
import Adminsidebar from './components/AdminSidebar';
import AdminNewSidebar from './components/AdminNewSidebar';
import StaffDetails from './components/StaffDetails';
import StaffDetailsInTabs from './components/StaffDetailsInTabs';
import AllDepartments from './components/AllDepartments';
import AdminCoursesViewComponent from './components/AdminCoursesViewComponent';
import AdminRegistrationForm from './components/AdminRegistrationForm';
import AdminProfile from './components/AdminProfile';
import AddNewBatch from './components/staff/AddNewBatch';
import EnrollForm from './components/EnrollmentForm';
import NewEnrolledStudentsList from './components/staff/NewEnrolledStudentsList';
import AllStudentsDetailsTable from './components/staff/AllStudentsDetailsTable';
import AdminBatchesView from './components/AdminBatchesView';
import StudentDetailsView from './components/AdminStudentsView';
import CourseBatchManager from './components/staff/CourseBatchManager';

//import { useAuth } from './AuthenticationProvider';
//<Route path="/attendance/:stdid" element={userType === 'student' ? <SelfAttendance user={user} /> : <Navigate to="/" />} />
import AllCourses from './components/DefaultAllCourses';
import About from './components/About';
import Contact from './components/Contact';
import Hero from './components/HeroComponent';
//import DarkVariantExample from './components/Carousels';
import GalleryCarousel from './components/GalleryCarousel';
import DetailedDescriptionAboutCourses from './components/DetailedDescriptionAboutCourses';
import Footer from './components/Footer';


export let userObjects = createContext();
export let courseContext = createContext();
export let userCont = createContext();
function App() {
  let [token, setToken] = useState(null);
  let [user,setUser] = useState();
  let [isAuthenticated, setIsAuthenticated] = useState(false);
  let [courses,setCourses] = useState([]);
  const [userType, setUserType] = useState(null);
  let [stdObj,setStdObj] = useState([]);
  let [staffobj,setStaffobj] = useState([]);
  //let [backbtn,setBackbtn] = useState('') - This is to update data in back button

  return (
    <>
    <Router>
      <userCont.Provider value={[[user,setUser],[token, setToken],[isAuthenticated, setIsAuthenticated],[userType, setUserType]]} >
      {user && <Navbar />}
      {user ?'': <DefaultNavbar />}
      
      
      
      
        <courseContext.Provider value={[courses,setCourses]} >
        <userObjects.Provider value={[[stdObj,setStdObj],[staffobj,setStaffobj]]} >
          <Routes>
            
            <Route path='/about' element={<About />} />
            <Route path='/contact' element={<Contact />} />
            <Route path='/enrollform' element={<EnrollForm />} />
            <Route path='/startingallcourses' element={<AllCourses />} />
            <Route path='/coursedescription/:courseId' element={<DetailedDescriptionAboutCourses />} />
            <Route path='/adminlogin' element={<LoginAdmin />}/>
            <Route path="/profile" element={<ProtectedRoute><ProfileOverlay /></ProtectedRoute>} />
            <Route path="/login" element={<Loginlinks />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/stdlogout" element={<ProtectedRoute><StdLogout /></ProtectedRoute>} />
            <Route path="/studentforgotpassword" element={<StudentForgotPassword />} />
            <Route path="/your-courses" element={userType === 'student' ? <Courses user={user} /> : <Navigate to="/" />} />
            <Route path="/attendance/:stdid" element={<ProtectedRoute><SelfAttendance user={user}  /></ProtectedRoute>} />
            <Route path="/performance" element={userType === 'student' ? <Performance user={user} /> : <Navigate to="/" />} />
            <Route path="/reset-password" element={<ProtectedRoute><PasswordReset /></ProtectedRoute>} />
            <Route path="/reset-password-confirm/:uidb64/:token" element={<ProtectedRoute><PasswordResetConfirm /></ProtectedRoute>} />
            <Route path="/home" element={<ProtectedRoute><Home userType={userType} user={user} /></ProtectedRoute>} />
            <Route path="/registerstd" element={<RegisterStudent/>}/>
            <Route path="/std" element={<LoginStudent />} />
            <Route path="/stafflogin" element={<LoginStaff />} />
            <Route path="/admin" element={<ProtectedRoute><AdminDashbord /></ProtectedRoute>} />
            <Route path="/student" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />
            <Route path="/stdattendance" element={<ProtectedRoute><StudentSelfAttendance /></ProtectedRoute>} />
            <Route path="/stdselfperformance" element={<ProtectedRoute><StudentSelfPerformance /></ProtectedRoute>} />
            <Route path="/stdselfperformancechart/" element={<ProtectedRoute><StudentSelfPerformanceInChart /></ProtectedRoute>} />
            
            

            <Route path="/registeradmin" element={<ProtectedRoute><AdminRegistrationForm /></ProtectedRoute>} />
            <Route path="/adminprofile" element={<ProtectedRoute><AdminProfile /></ProtectedRoute>} />
            <Route path="/addnewbatch" element={<ProtectedRoute><AddNewBatch /></ProtectedRoute>} />
            <Route path="/admincourseview" element={<ProtectedRoute><AdminCoursesViewComponent /></ProtectedRoute>} />
            <Route path="/adminbatches/:courseId/" element={<ProtectedRoute><AdminBatchesView /></ProtectedRoute>} />
            <Route path="/studentslist/" element={<ProtectedRoute><StudentDetailsView /></ProtectedRoute>} />
            <Route path="/newstaffdashboard/" element={<ProtectedRoute><StaffNewDashboard /></ProtectedRoute>} />


            <Route path="/addcourse" element={<ProtectedRoute><AddNewCourse /></ProtectedRoute>} />
            <Route path="/adddepartment" element={<ProtectedRoute><AddNewDepartment /></ProtectedRoute>} />
            <Route path="/alldepartments" element={<ProtectedRoute><AllDepartments /></ProtectedRoute>} />
            <Route path="/allstdattendance" element={<ProtectedRoute><StudentAttendanceTable /></ProtectedRoute>} />
            <Route path="/allstddetails" element={<ProtectedRoute><AllStudentsTable /></ProtectedRoute>} />
            <Route path="/allstddetailstableforexecutives" element={<ProtectedRoute><AllStudentsDetailsTable /></ProtectedRoute>} />
            <Route path="/registerstaff" element={<ProtectedRoute><AddNewStaffByAdmin /></ProtectedRoute>} />
            <Route path="/staffforgotpassword" element={<ProtectedRoute><ForgotPasswordForStaff /></ProtectedRoute>} />
            <Route path="/changepassword" element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} />
            <Route path="/staff" element={<ProtectedRoute><StaffDashboard /></ProtectedRoute>} />
            <Route path="/officeexecutivedashboard" element={<ProtectedRoute><ContactedPersonsDetails /></ProtectedRoute>} />
            <Route path="/enrolledstdlist" element={<ProtectedRoute><NewEnrolledStudentsList /></ProtectedRoute>} />
            <Route path="/checknewregistrations" element={<ProtectedRoute><CheckNewRegistrations /></ProtectedRoute>} />
            <Route path="/registerstudent" element={<ProtectedRoute><RegisterNewStudentByStaff /></ProtectedRoute>} />
            <Route path="/staffnav" element={<StaffDashboardNav />} />
            <Route path="/dashboard/:course" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/dashboard/courses" element={<ProtectedRoute><CoursesComponent /></ProtectedRoute>} />
            <Route path="/otherstaff" element={<ProtectedRoute><OtherStaff /></ProtectedRoute>} />
            <Route path="/staffpython" element={<StaffPythonDash />} />
            <Route path="/batches/attendance/:courseId/:batch_id" element={<ProtectedRoute><KnowStudentAttendanceByStaff /></ProtectedRoute>} />
            <Route path="/batches/attendance/modify/:courseId/:batch_id" element={<ProtectedRoute><AddStudentAttendanceByStaff /></ProtectedRoute>} />
            <Route path="/courses/:courseId/batches" element={<ProtectedRoute><BatchDetails /></ProtectedRoute>} />
            <Route path="/addtestreport" element={<ProtectedRoute><SearchAndSubmitTest /></ProtectedRoute>} />
            <Route path="/weekly_tests/:stduname" element={<ProtectedRoute><StudentWeeklyTests /></ProtectedRoute>} />
            <Route path="/mock_interviews/:stduname" element={<ProtectedRoute><StudentMockInterviews /></ProtectedRoute>} />
            <Route path="/course_batch_manager" element={<ProtectedRoute><CourseBatchManager /></ProtectedRoute>} />

            <Route path="/staffdetails" element={<ProtectedRoute><StaffDetails /></ProtectedRoute>} />
            <Route path="/staffdetailsintabs" element={<ProtectedRoute><StaffDetailsInTabs /></ProtectedRoute>} />
            
            
            

          </Routes>
          </userObjects.Provider>
          </courseContext.Provider>
        {user?'':<GalleryCarousel />}
        {user?'': <Hero />}
        {user?'': <About />}
      {user?'': <Contact />}
      <Footer />
      {userType==='adminuser'?<Adminsidebar/>:''}
        </userCont.Provider>
    </Router>
    </>
  );
}

export default App;

/*
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, useNavigate } from 'react-router-dom';
import Login from './Logincommon';
import StudentDashboard from './StudentDashboard';
import StaffDashboard from './StaffDashboard';

function App() {
  const [userGroup, setUserGroup] = useState(null);
  let navigate=useNavigate();

  return (
    <Router>
      <Route path="/login">
        <Login setUserGroup={setUserGroup} />
      </Route>
      <Route path="/student">
        {userGroup === 'student' ? <StudentDashboard /> : navigate("/login")}
      </Route>
      <Route path="/staff">
        {userGroup === 'staff' ? <StaffDashboard /> : navigate("/login")}
      </Route>
    </Router>
  );
}

export default App;
*/

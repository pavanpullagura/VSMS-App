import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { userCont, courseContext } from './App';
import './StaffDashboard.css';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import { FaUserPlus, FaRegListAlt, FaClipboardList, FaChalkboardTeacher, FaUserEdit, FaSchool } from 'react-icons/fa';

function StaffDashboard() {
  const [allStudentsDetails, setAllStudentsDetails] = useState(null);
  let navigate = useNavigate();
  let [[user, setUser], [token, setToken], [isAuthenticated, setIsAuthenticated], [userType, setUserType]] = useContext(userCont);
  let [courses, setCourses] = useContext(courseContext);

  let displayCourses = async () => {
    console.log(token, isAuthenticated);
    try {
      let response = await axios.get('http://127.0.0.1:8000/staff/allcourses/',
        {},
        {
          headers: {
            "Authorization": 'Token ' + token,
          },
        }
      );
      if (response.status === 200) {
        setCourses(response.data);
        console.log(courses);
        navigate('/dashboard/courses')
      } else {
        console.error('Fetching courses failed with status:', response.status);
      }
    } catch (error) {
      console.error('There was an error fetching data!', error);
    }
  }

  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
      const fetchUserProfile = async () => {
          if (token) {
              try {
                  const response = await axios.get(`http://127.0.0.1:8000/${userType}/profile/${user}/`, {
                      headers: {
                          'Authorization': 'Token ' + token
                      }
                  });
                  if(userType=='staff'){
                    setUserProfile(response.data.profileObj[0]);
                    //setObjid(parseInt(response.data.profileObj[0]['id']))
                  }else{
                    setUserProfile(response.data.profileObj[0]);
                    //setObjid(parseInt(response.data.profileObj[0]['id']))
                  }
                    // Assuming profileObj is an array
                  setLoading(false);
                  console.log('USER PROEJROJSEFJ',userProfile,response.data.profileObj);
                  //setObjid(parseInt(response.data.profileObj[0]['id']))
                  console.log(response.data.profileObj[0]['id']);
                  //console.log(objid);
              } catch (err) {
                  setError(err);
                  setLoading(false);
              }
          }
      };

      fetchUserProfile();
  }, [token, user, userType]);

  return (
    <div className='dashboard-container'>
      <header className='dashboard-header'>
        <h1>Welcome, {userProfile ? userProfile.first_name + ' '+userProfile.last_name : 'Staff'}</h1>
      </header>
      <div className='dashboard-main'>
        <div className='dashboard-actions'>
          {user && (
            <button className='dashboard-button' onClick={displayCourses}>
              <FaSchool className='dashboard-icon' />
              Courses Wise Students Attendance Details
            </button>
          )}
          <Link to="/addnewbatch" className='dashboard-button'>
            <FaUserPlus className='dashboard-icon' />
            Add New Batch
          </Link>
          <Link to="/checknewregistrations" className='dashboard-button'>
            <FaRegListAlt className='dashboard-icon' />
            Check New Registration Requests
          </Link>
          <Link to="/allstdattendance" className='dashboard-button'>
            <FaClipboardList className='dashboard-icon' />
            View All Students Attendance
          </Link>
          <Link to="/addtestreport" className='dashboard-button'>
            <FaChalkboardTeacher className='dashboard-icon' />
            Submit Student Test Reports
          </Link>
          <Link to="/allstddetails" className='dashboard-button'>
            <FaUserEdit className='dashboard-icon' />
            Each Students Performance Reports
          </Link>
          <Link to="/registerstudent" className='dashboard-button'>
            <FaUserPlus className='dashboard-icon' />
            Register New Student
          </Link>
          <Link to="/newstaffdashboard" className='dashboard-button'>
            <FaSchool className='dashboard-icon' />
            New Interface
          </Link>
        </div>
      </div>
    </div>
  );
}

export default StaffDashboard;

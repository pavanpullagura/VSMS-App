import React, {  useEffect, useState,useContext } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { userCont } from './App';
import './StudentDashboard.css';


function StudentDashboard({token, onLogout}) {
  let [user,setUser] = useContext(userCont);
  const [studentDetails, setStudentDetails] = useState(null);

  
/*
  useEffect(() => {
    const fetchData = async () => {
      const accessToken = localStorage.getItem('access_token');
      const response = await axios.get('http://localhost:8000/api/student/', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      setStudentDetails(response.data);
    };
    fetchData();
  }, []);
*/
/*
  const handleLogout =  () => {
    const success =  logout(token, () => {
        onLogout();
        navigate('/login'); // Redirect to login page
    });
    if (!success) {
        console.error('Logout failed');
    }
  };
  */



 



 

 

 
  return (
    <>
    <div className='dashboard_heading'>
      <div><h2>{user} Dashboard</h2></div>
      
    </div>
    <div className='performance_div'>
      <div className='dashboard_nav'>
        <Link to="/stdattendance"><h4>Attendance</h4></Link>
      </div>
      <div className='dashboard_nav'>
        <Link ><h4>Weekly Tests</h4></Link>
      </div>
      <div className='dashboard_nav'>
        <Link ><h4>Mock Interviews</h4></Link>
      </div>
      <div className='dashboard_performance'>
        <p>Overall Attendance Percentage</p>
        <h1>70%</h1>
        <progress value="70" max="100"></progress>
        
      </div>

    </div>

    </>
  );
}

export default StudentDashboard;

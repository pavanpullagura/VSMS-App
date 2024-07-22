import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { userCont } from './App';
import './StaffDashboard.css';
import { Link,useNavigate } from 'react-router-dom';

function StaffDashboardNav() {
  let [show,setShow]=useState(false);
  const [allStudentsDetails, setAllStudentsDetails] = useState(null);
  let [[user, setUser], [token, setToken], [isAuthenticated, setIsAuthenticated],[userType, setUserType]]= useContext(userCont);
  let navigate=useNavigate();

  useEffect(() => {
      axios.get('http://127.0.0.1:8000/first/staff/', {
        headers: { "Authorization": 'Token '+token }
      }).then((resp)=>{
        console.log(resp);
        setAllStudentsDetails(resp.data);
      }).catch((err)=>{
        console.log('error raised');
        console.log(err);
      })
      
  }, []);
  const handleLogout = async () => {
    try {
      console.log(token);
      const response = await axios.post(
        'http://127.0.0.1:8000/staff/logout/',
        {},
        {
          headers: {
            "Authorization":'token '+token,
          },
        }
      );
      if (response.status === 200) {
        setToken('');
        navigate('/stafflogin');
      } else {
        console.error('Logout failed with status:', response.status);
      }
    } catch (error) {
      console.error('There was an error logging out!', error);
    }
  };
  

  return (
    <div className='main'>
      <div className='usernamediv'>{user}</div>
      <div><button onClick={handleLogout}>LOGOUT</button></div>
      <nav>
        <h3>Java Full Stack</h3>
        <Link to="/staffpython"><h3>Python Full Stack</h3></Link>
        <h3>DevOps</h3>
        <h3>Testing Tools</h3>
      </nav>
      </div>
  );
}

export default StaffDashboardNav;

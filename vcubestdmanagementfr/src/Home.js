//import './Home.css';
import React, { useState,useContext } from 'react';
import { Link,useNavigate } from "react-router-dom";
import axios from 'axios';
import logoPic from "./images/cropped-cropped-logo-c-removebg-preview.png";
import { userCont } from './App';
//import Logout from './LogoutUsage';
//import StudentLogin from './Studentlogin';
import Navbar from './components/Navbar';
import Sidebar from './Sidebar';


function Home(){
    let [user,setUser] = useContext(userCont);
    let [loggedOut, setLoggedOut] = useState(false);
    let navigate = useNavigate();
   
    let handleLogout = async () => {
        try {
          const response = await axios.post('http://127.0.0.1:8000/first/api/logout/');
          if (response.data.message === 'Logged out successfully') {
            setLoggedOut(true);
            navigate('/std');
          }
        } catch (error) {
          console.error(error);
        }
      };
      //{user?<h2>{user}<Logout /></h2>:''}
      /*
    return(
        <>
        <div className="nav_main">
            
            <Link to='/std'><img src={logoPic}  height="100px" width="200px"/></Link>
               <h1>Welcome to VCUBE Management</h1> 
            
            <div >
            
            
            </div>
            
        </div>
        
        <div>
      
      {user?'':<StudentLogin />}
      
    </div>
   
        </>
    );*/
    return (
      <>
      
      <div className='heading'></div>
        <Navbar />
        <Sidebar />
      </>
    );
}

export default Home;
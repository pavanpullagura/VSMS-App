import './DefaultNavbar.css';
import React, { useState, useContext,useEffect } from 'react';
import { Link,Navigate,useNavigate } from 'react-router-dom';
import axios from 'axios';
import { userCont } from '../App';
import { useAuth } from '../AuthenticationProvider';
import logo from '../images/cropped-cropped-logo-c-removebg-preview.png';

const DefaultNavbar = () => {
     //let {token} = useAuth();
     /*
    const [dropdownVisible, setDropdownVisible] = useState(false);
    let [stdObj,setStdObj] = useState([]);
    const { token, setToken } = useAuth();
    let navigate=useNavigate();

    const handleLogout = () => {
        // Implement logout logic here
    };

    const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible);
    };

   
    const getStudentObj = async()=>{
      try{
       const response = await axios.post('http://127.0.0.1:8000/student/getid/',{
        'username':user
       },{
        headers:{
          'Authorization':'Token '+token
        }
       })
        setStdObj(response.data);
        //<Navigate to={`/attendance/${stdObj.id}`} />
        //console.log('StudentObj',stdObj);
        //console.log('StdOBJ id',stdObj[0].id);
        //navigate(`/attendance/${stdObj[0].id}`)
        console.log(response.data);
        
       } catch (error) {
        console.error('Error fetching attendance data', error);
    }
    };
   */
 

    return (
        <>
        <div className='default_navbar_main_div'>
        <header className="header">
        <div className="nav_logo"><img src={logo} alt='vcube' height='80px' width='200px'/></div>
    
        <nav className="navbar2">
            
            <ul>
                
                <li><Link to="/">HOME</Link></li>
                <li><Link to="/startingallcourses">ALL COURSES</Link></li>
                <li><Link to="/about">About</Link></li>
                <li><Link to="/contact">Contact Us</Link></li>
                <li><Link to="/login">LOGIN</Link></li>
            </ul>
            <Link to='/enrollform'><button className="enroll_btn">Enroll Now</button></Link>
        </nav>
        </header>
        <div className='below_defaultnavbar_imagediv'>
            <h1 className='below_defaultnavbar_heading'>Welcome to <span className='vcube_startletter'>V</span><span className='vcube_reamining_name'>CUBE</span>&nbsp;application</h1>
        </div>
        </div>
        </>
    );
};

export default DefaultNavbar;
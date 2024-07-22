import React, { useState,useContext } from 'react';
import axios from 'axios';
import { Link,useNavigate,Routes,Route } from "react-router-dom";
import './studentlogin.css';
import StudentDashboard from './StudentDashboard';
import { userCont } from './App';

function StudentLogin(){
    let [[user,setUser],[token, setToken],[isAuthenticated, setIsAuthenticated],[userType, setUserType]] = useContext(userCont);
    let [username, setUsername] = useState('');
    let [password, setPassword] = useState('');
    let [group, setGroup] = useState('');
    let navigate = useNavigate();
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://127.0.01:8000/first/api/login/', {
                username: username,
                password: password
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            setToken(response.data.access);
            setGroup(response.data.group);
            console.log(group);
            setUser(username);
            setIsAuthenticated(true);
            if(group=="Students"){
                navigate('/student');
            }  else if (group=="Management"){
                navigate('/staffnav');
            } else{
                navigate('/std');
            }
            
            
        } catch (error) {
            console.error("There was an error logging in!", error);
        }
    };
  
    return(
        <>
        <div className='login'>
            <form onSubmit={handleLogin} className='login_form'>
                <p>Enter details to show the students details</p>
                <input type="text" placeholder="User Name" value={username} onChange={(e)=>setUsername(e.target.value)}/><br/>
                <input type="text" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)}/><br/>
                <button type="submit">Login</button>
            </form>
            
        </div>
        <Link to="/login">BACK</Link>
        
        </>
    );
}
export default StudentLogin;
import React, { useState } from 'react';
import axios from 'axios';
import { Link,useNavigate } from "react-router-dom";

function ManagementLogin(){
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [token, setToken] = useState('');
    const [group, setGroup] = useState('');
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
            {group==="Management"?navigate('/staff') : <p>Sorry You are not a staff User</p>}
            
            
        } catch (error) {
            console.error("There was an error logging in!", error);
        }
    };
    return(
        <>
        <div>
            <form onSubmit={handleLogin}>
                <p>Enter details to show the students details</p>
                <input type="text" placeholder="User Name" value={username} onChange={(e)=>setUsername(e.target.value)}/><br/>
                <input type="text" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)}/><br/>
                <button type="submit">Login</button>
            </form>
            {token && <p>Token: {token}</p>}
            {group && <p>Group: {group}</p>}
        </div>
        <Link to="/login">BACK</Link>
        </>
    );
}
export default ManagementLogin;
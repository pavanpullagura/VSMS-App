// Login.js
import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ setUserType, setUser }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        axios.post('/api/login/', { username, password })
            .then(response => {
                setUser(response.data.user);
                setUserType(response.data['user_type']);
            })
            .catch(error => {
                console.error("There was an error logging in!", error);
            });
    };

    return (
        <div className="login-page">
            <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                    placeholder="Username" 
                    required 
                />
                <input 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    placeholder="Password" 
                    required 
                />
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;

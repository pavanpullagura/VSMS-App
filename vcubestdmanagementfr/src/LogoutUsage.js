// src/api/auth.js
/*
import axios from 'axios';


const logout = async (token, onLogoutSuccess) => {
    try {
        const response = await axios.post('http://127.0.0.1:8000/first/api/logout/',
        
            {
                headers: {
                    Authorization: 'Token '+token
                }
            }
        );
        if (response.status === 200) {
            onLogoutSuccess();
            return true;
        }
    } catch (error) {
        console.error('Logout failed:', error);
        return false;
    }
};

export default logout;
*/
// components/Logout.js
/*
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const [loggedOut, setLoggedOut] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (loggedOut) {
      navigate('/login', { replace: true });
    }
  }, [loggedOut, navigate]);

  const handleLogout = async () => {
    try {
      const response = await axios.post('http://localhost:8000/api/logout/');
      if (response.data.message === 'Logged out successfully') {
        setLoggedOut(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Logout;
*/
import axios from 'axios';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      await axios.post('http://127.0.0.1:8000/first/api/logout/', {
        refresh_token: refreshToken
      });
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      axios.defaults.headers.common['Authorization'] = null;
      console.log('logout success');
      navigate('/login');
    } catch (error) {
      console.error('There was an error logging out!', error);
    }
  };

  return (
    <button onClick={handleLogout}>Logout</button>
  );
};

export default Logout;


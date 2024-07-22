
import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState('');
  const [user, setUser] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [courses, setCourses] = useState([]);
  const [userType, setUserType] = useState(null);
  const [stdObj, setStdObj] = useState([]);
  const [staffObj, setStaffObj] = useState([]); 

  return (
    <AuthContext.Provider value={{ 
      token, 
      setToken, 
      user, 
      setUser, 
      isAuthenticated, 
      setIsAuthenticated, 
      courses, 
      setCourses, 
      userType, 
      setUserType, 
      stdObj, 
      setStdObj, 
      staffObj, 
      setStaffObj 
    }}>
      {children}
    </AuthContext.Provider>
  );
};


/*
import React, { createContext, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ StudentDashboard },{ StaffDashboard }) => {
    const [token, setToken] = useState(null);
    const navigate = useNavigate();

    const login = (newToken) => {
        setToken(newToken);
    };

    const logout = () => {
        setToken(null);
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ token, login, logout }}>
            {StudentDashboard}{StaffDashboard}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
*/



// api.js

import axios from 'axios';
import { useAuth } from '../AuthenticationProvider';
import { useState,useEffect,useContext } from 'react';
import { userCont } from '../App';

const useUserProfile = () => {
    //const { token,userType } = useAuth();
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    let [[user,setUser],[token, setToken],[isAuthenticated, setIsAuthenticated],[userType, setUserType]] = useContext(userCont);
  
    useEffect(() => {
      const fetchUserProfile = async () => {
        if (token) {
          try {
            const response = await axios.get(`http://127.0.0.1:8000/${userType}/profile/${user}/`, {
              headers: {
                'Authorization': `Token ${token}`
              }
            });
            setUserProfile(response.data);
            console.log(userProfile);
            setLoading(false);
          } catch (err) {
            setError(err);
            setLoading(false);
          }
        } 
      };
  
      fetchUserProfile();
    }, [token]);
  
    return { userProfile, loading, error };
  };
  
  export default useUserProfile;

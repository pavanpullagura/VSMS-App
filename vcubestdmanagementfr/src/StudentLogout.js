import { userCont } from "./App";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
const StdLogout = async () => {
  let [[user,setUser],[token, setToken],[isAuthenticated, setIsAuthenticated],[userType, setUserType]] = useContext(userCont);
  let navigate=useNavigate();
    try {
      
      console.log(token);
      const response =  await axios.post(
        'http://127.0.0.1:8000/student/logout/',
        {},
        {
          headers: {
            "Authorization":'token '+token,
          },
        }
      );
      if (response.status === 200) {
        setToken('');
        setIsAuthenticated(false);
        navigate('/std');
        
      } else {
        console.error('Logout failed with status:', response.status);
      }
    } catch (error) {
      console.error('There was an error logging out!', error);
    }
  };
export default StdLogout;  
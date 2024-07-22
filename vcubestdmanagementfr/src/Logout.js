import { userCont } from "./App";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
const Logout = async () => {
  let [[user,setUser],[token, setToken],[isAuthenticated, setIsAuthenticated],[userType, setUserType]] = useContext(userCont);
  let navigate=useNavigate();
    try {
      
      console.log(token);
      const response =  await axios.post(
        `http://127.0.0.1:8000/${userType}/logout/`,
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
        if (userType==="adminuser"){
          navigate('/adminlogin')
        }
        else if(userType==="staff"){
          navigate('/stafflogin')
        }
        
      } else {
        console.error('Logout failed with status:', response.status);
      }
    } catch (error) {
      console.error('There was an error logging out!', error);
    }
  };
export default Logout;  
import { userCont } from "./App";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import axios from "axios";
   

function StaffPythonDash(){
    let navigate = useNavigate();
    let [[user, setUser], [token, setToken], [isAuthenticated, setIsAuthenticated],[userType, setUserType]]= useContext(userCont);

    let getBatches = async() =>{
        try {
            console.log(token);
            const response = await axios.post(
              'http://127.0.0.1:8000/staff//',
              {},
              {
                headers: {
                  "Authorization":'token '+token,
                },
              }
            );
            if (response.status === 200) {
              setToken('');
              navigate('/stafflogin');
            } else {
              console.error('Logout failed with status:', response.status);
            }
          }  catch (error) {
            console.error('There was an error logging out!', error);
          }
        };
        getBatches();
    
    return(
        <>
        
        </>
    );
}
export default StaffPythonDash;
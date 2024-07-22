import { useNavigate,Link } from "react-router-dom";
import { useContext,useState,useEffect } from "react";
import { userCont } from "../App";
import axios from "axios";
import './LoginForAdmin.css';
import logo from '../images/cropped-cropped-logo-c-removebg-preview.png';
//import { useAuth } from "./AuthenticationProvider";
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import BackButton from "./BackButtonFunctionality";


function LoginAdmin(){
    let [[user,setUser],[token, setToken],[isAuthenticated, setIsAuthenticated],[userType, setUserType]] = useContext(userCont);
    let [uname,setUname] = useState('');
    let [pwd,setPwd] = useState('');
    let [showPassword, setShowPassword] = useState(false);
    let a='';
    //let [[stdObj,setStdObj],[staffobj,setStaffobj]] = useContext(userObjects);
    //let {setToken,setIsAuthenticated,setUser,setUserType} = useContext(useAuth);
    let navigate = useNavigate();

    let handleLogin = (e) => {
        e.preventDefault();
        let credentials = {
            "username": uname,
            "password": pwd
        };
        let url = "http://127.0.0.1:8000/adminuser/login/";
        axios.post(url, credentials).then((resp) => {
            console.log(resp);
            if (resp.status === 200) {
                setToken(resp.data['token']);
                setIsAuthenticated(true);
                setUser(uname);
                setUserType(resp.data['usertype']);
                console.log('userType',userType);
            } else {
                setIsAuthenticated(false);
            }
        }).catch((err) => {
            console.log(err);
            setIsAuthenticated(false);
        });
    };

    useEffect(() => {
        if (isAuthenticated) {
            console.log(userType);  // This will log the updated userType
            if (userType) {
                navigate('/admin');
            }
        }
    }, [userType, isAuthenticated, navigate]);
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    
    return(
        <>
        <div>
            <BackButton />
        </div> 
        <div className="adminloginmaindiv">
             
        <form onSubmit={handleLogin} className="admin_login_form">
            <div className="login-welcome-row">
                <Link to=""><img src={logo} alt="logo" className="adminloginformlogo" /></Link>
                <h1>Welcome back</h1>
                <p>Please enter your details!</p>
            </div>
            <div className="admininputwrapper">
                <input type="text" name="uname" placeholder="Username" className="admininputfield" onChange={(e)=>setUname(e.target.value)} required/>
                <label htmlFor="uname" className="admininputlabel">Username:</label>
                <svg className="admininputicon"><AccountBoxIcon/></svg>
            </div>
            <div className="admininputwrapper">
                <input  type={showPassword ? "text" : "password"} name="pwd"  placeholder="Password" className="admininputfield" onChange={(e) => setPwd(e.target.value)} required />
                <label htmlFor="pwd" className="admininputlabel">Password:</label>
                <div className="admininputicon" onClick={togglePasswordVisibility}>
                        {showPassword ? <svg className="admininputicon"><VisibilityOff /></svg>  : <svg className="admininputicon"><Visibility /></svg>}
                    </div>
            </div>
            
            <input type="submit" className="admin_login_form_button" value="LOGIN"/>
            <Link to="/staffforgotpassword" >forgot password?</Link>
        </form>
        </div>
        </>
    );
}
export default LoginAdmin;
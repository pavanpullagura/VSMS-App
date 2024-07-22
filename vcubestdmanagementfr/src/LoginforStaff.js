import { useNavigate,Link } from "react-router-dom";
import { useContext,useState } from "react";
import { userCont,userObjects } from "./App";
import axios from "axios";
import './LoginForStaff.css';
import BackButton from "./components/BackButtonFunctionality";
//import { useAuth } from "./AuthenticationProvider";


function LoginStaff(){
    let [[user,setUser],[token, setToken],[isAuthenticated, setIsAuthenticated],[userType, setUserType]] = useContext(userCont);
    let [uname,setUname] = useState('');
    let [pwd,setPwd] = useState('');
    let [staffdept,setStaffdept] = useState('');
    //let [[stdObj,setStdObj],[staffobj,setStaffobj]] = useContext(userObjects);
    //let {setToken,setIsAuthenticated,setUser,setUserType} = useContext(useAuth);
    let navigate = useNavigate();

    let handleLogin = (e)=>{
        e.preventDefault();
        let credentials = {
            "username":uname,
            "password":pwd
        }
        let url = "http://127.0.0.1:8000/staff/login/"
        axios.post(url,credentials).then((resp)=>{
            console.log(resp);
            if (resp.status==200){
                console.log(resp);
                setToken(resp.data['token']);
                setIsAuthenticated(true);
                setUser(uname);
                let user = uname;
                console.log('User:',user,uname);
                setUserType('staff')
                console.log(userType);
                setStaffdept(resp.data['staffdept'])
                //setStaffobj(resp.data['staffobj'])
                //console.log(resp.data["staffobj"])
                let staffdeptid = resp.data['staffdept']
                console.log(staffdeptid);
                console.log(staffdept,resp.data['staffdept']);
                if (staffdeptid === 1022 || staffdept === '1022'){
                    navigate('/officeexecutivedashboard');
                }else{
                    navigate('/staff');
                }
            }else{
                
                setIsAuthenticated(false);
                console.log(isAuthenticated);
            }
        }).catch((err)=>{
            console.log(err);
            setIsAuthenticated(false);
            //console.log(isAuthenticated);
        })
    }
    return(
        <>
        <div><BackButton /></div>
        <div className="logindiv_for_staff">
        <div className="formpositiondiv">
            <div className="bgimagedivfor_staff"></div>
            <form onSubmit={handleLogin} className="login_form_for_staff">
                <input type="text" name="uname" placeholder="USERNAME" onChange={(e)=>setUname(e.target.value)}/> <br/>
                <input type="text" name="pwd" placeholder="PASSWORD" onChange={(e)=>setPwd(e.target.value)}/><br/>
               
                <button type="submit" className="login_btn">LOGIN</button>
                <p>---------------&nbsp;<Link to="/staffforgotpassword" >forgot password?</Link>&nbsp;---------------</p>
            </form>
        </div>
        </div>
        </>
    );
}
export default LoginStaff;
import { Link, useNavigate } from "react-router-dom";
import { useContext,useState } from "react";
import { userCont,userObjects } from "./App";
import axios from "axios";
import './LoginforStudent.css';
import { useAuth } from "./AuthenticationProvider";
import BackButton from "./components/BackButtonFunctionality";

function LoginStudent() {
    let [[user, setUser], [token, setToken], [isAuthenticated, setIsAuthenticated], [userType, setUserType]] = useContext(userCont);
    let [[stdObj, setStdObj], [staffobj, setStaffobj]] = useContext(userObjects);
    let [uname, setUname] = useState('');
    let [pwd, setPwd] = useState('');
    let [error, setError] = useState('');
    let navigate = useNavigate();

    let handleLogin = (e) => {
        e.preventDefault();
        let credentials = {
            "username": uname,
            "password": pwd
        }
        let url = "http://127.0.0.1:8000/student/login/";
        axios.post(url, credentials).then((resp) => {
            if (resp.status === 200) {
                setToken(resp.data.token);
                setIsAuthenticated(true);
                setUser(uname);
                setUserType('student');
                setStdObj(resp.data['stdObj']);
                console.log(stdObj,resp.data['stdObj']);
                navigate('/home');
            } else if(resp.status === 500){
                setIsAuthenticated(false);
                setError('User does not exist, Incorrect Username!');
            } else{
                setIsAuthenticated(false);
                setError(resp.data['detail']);
            }
        }).catch((err) => {
            console.log(err);
            setIsAuthenticated(false);
            if (err['response']['status'] === 500){
                setError('\nPlease Provide VALID USERNAME');
            } else if(err['response']['status'] === 203){
                setError('Incorrect PASSWORD!');
            } else{
                setError('Invalid Credentials');
            }
        })
    }

    return (
        <>
        <div><BackButton /></div>
            <div className="loginformdiv">
                <div className="formpositiondiv">
                <div className="bgimagediv"><h2></h2></div>
                <form onSubmit={handleLogin} className="stdloginformdiv">
                    <label className="loginformlabels">USERNAME:<input type="text" name="uname" onChange={(e) => setUname(e.target.value)} /></label><br />
                    <label className="loginformlabels">PASSWORD:<input type="password" name="pwd" onChange={(e) => setPwd(e.target.value)} /></label><br />
                    <p>{error}</p>
                    <input type="submit" value="LOGIN" />
                    <Link to='/studentforgotpassword'><p className="forgotpass">-------forgot password?-------</p></Link>
                    <p>Don't have an account ?<Link to="/registerstd">Register</Link></p>
                </form>
                </div>
            </div>
        </>
    );
}

export default LoginStudent;

/*
//let { user,token,isAuthenticated,userType,stdObj,setStdObj,setIsAuthenticated,setToken,setUser,setUserType } = useAuth();

function LoginStudent(){
    let [[user,setUser],[token, setToken],[isAuthenticated, setIsAuthenticated],[userType, setUserType]] = useContext(userCont);
    let [[stdObj,setStdObj],[staffobj,setStaffobj]] = useContext(userObjects);
    let [uname,setUname] = useState('');
    let [pwd,setPwd] = useState('');
    let navigate = useNavigate();
    //let {setToken,setIsAuthenticated,setUser,setUserType} = useContext(useAuth);

    let handleLogin = (e)=>{
        e.preventDefault();
        let credentials = {
            "username":uname,
            "password":pwd
        }
        let url = "http://127.0.0.1:8000/student/login/"
        axios.post(url,credentials).then((resp)=>{
            console.log(resp);
            if (resp.status==200){
                console.log(resp);
                setToken(resp.data['token']);
                setIsAuthenticated(true);
                setUser(uname);
                setUserType('student');
                //setStdObj(resp.data["stdObj"])
                //console.log(stdObj);
                navigate('/home');
            }else{
                
                setIsAuthenticated(false);
                //console.log(isAuthenticated);
            }
        }).catch((err)=>{
            console.log(err);
            setIsAuthenticated(false);
            //console.log(isAuthenticated);
        })
    }
    return(
        <>
        <div className="loginformdiv">
        <form onSubmit={handleLogin} className="stdloginformdiv">
            <label>USERNAME:<input type="text" name="uname" onChange={(e)=>setUname(e.target.value)}/></label><br/>
            <label>PASSWORD:<input type="text" name="pwd" onChange={(e)=>setPwd(e.target.value)}/></label><br/>
            <input type="submit" value="LOGIN"/>
            <p>Don't have an account ?<Link to="/registerstd">Register</Link></p>
        </form>
        
        </div>
        </>
    );
}
export default LoginStudent;
*/
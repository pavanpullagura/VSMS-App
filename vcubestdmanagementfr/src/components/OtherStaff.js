import { useEffect, useState ,useContext} from "react";
import { userCont } from "../App";
import axios from "axios";
import './StaffDetailsInTabs.css';
import BackButton from "./BackButtonFunctionality";



function OtherStaff(){
    let [staffDetailsArray,setStaffDetailsArray] = useState([]);
    const [[user, setUser], [token, setToken], [isAuthenticated, setIsAuthenticated], [userType, setUserType]] = useContext(userCont);
    const baseURL = "http://127.0.0.1:8000"; 
    
    useEffect(()=>{
        axios.get('http://127.0.0.1:8000/adminuser/getstaffdetails/').then((resp)=>{
            console.log(resp);
            setStaffDetailsArray(resp.data);
            console.log(resp.data);
        }
        ).catch((error)=>{
            console.log('error raised');
            console.log(error);
            
        })
    },[])
    console.log(staffDetailsArray);
    return(
        <>
         <div><BackButton /></div>
            <div className="staff_data_for_admin">
                <div className="staff_data_in_tabs">
                    {staffDetailsArray
                        .filter((staff) => staff.username !== user)
                        .map((staff) => (
                            <div className="staff_details_tabs" key={staff.username}>
                                <div className="staff_image_div" style={{height:'260px',backgroundImage:`url(${baseURL}/${staff.image})`,backgroundSize: 'cover', backgroundPositionY:'15%'}}>
                            
                            </div>
                                <div className="staff_data_div">
                                    <h4><b>Name:</b>&nbsp;{staff.first_name}&nbsp;{staff.last_name}</h4>
                                    <p><b>Department:</b>&nbsp;{staff.department}</p>
                                    <p><b>Email:</b>&nbsp;{staff.email}</p>
                                    <p><b>Mobile No:</b>&nbsp;{staff.contact_num}</p>
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </>
    );
}
export default OtherStaff;
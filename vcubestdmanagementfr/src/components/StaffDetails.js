import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { userCont } from "../App";
import './StaffDetails.css';
import BackButton from "./BackButtonFunctionality";

function StaffDetails() {
    let [staffDetailsArray, setStaffDetailsArray] = useState([]);
    let [deptsArray, setDeptsArray] = useState([]);
    const [[user, setUser], [token, setToken], [isAuthenticated, setIsAuthenticated], [userType, setUserType]] = useContext(userCont);
    const baseURL = "http://127.0.0.1:8000"; 

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/adminuser/getstaffdetails/').then((resp) => {
            setStaffDetailsArray(resp.data);
            console.log(staffDetailsArray);
        }).catch((error) => {
            console.log('error raised');
            console.log(error);
        });
    }, []);


    return (
        <>
            <div className="staff_table_for_admin">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Department</th>
                            <th>Email ID</th>
                            <th>Contact Number</th>
                            <th>Staff Image</th>
                            <th>Qualification</th>
                            <th>Address</th>
                        </tr>
                    </thead>
                    <tbody>
                        {staffDetailsArray.map((staff) => (
                            <tr key={staff.id}>
                                <td>{staff.first_name} {staff.last_name}</td>
                                <td>{staff.department_name}</td>
                                <td>{staff.email}</td>
                                <td>{staff.contact_num}</td>
                                <td style={{height:'80px',backgroundImage:`url(${baseURL}/${staff.image})`,backgroundSize: 'cover', backgroundPosition:'center'}}></td>
                                <td>{staff.qualification}</td>
                                <td>{staff.address}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}

export default StaffDetails;

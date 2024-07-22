import React, { useEffect, useState, useContext } from "react";
import { userCont } from "../App";
import axios from "axios";
import './StaffDetailsInTabs.css';
import BackButton from "./BackButtonFunctionality";

function StaffDetailsInTabs() {
    const [staffDetailsArray, setStaffDetailsArray] = useState([]);
    const [[user, setUser], [token, setToken], [isAuthenticated, setIsAuthenticated], [userType, setUserType]] = useContext(userCont);
    const baseURL = "http://127.0.0.1:8000";

    useEffect(() => {
        axios.get(`${baseURL}/adminuser/getstaffdetails/`)
            .then((resp) => {
                setStaffDetailsArray(resp.data);
            })
            .catch((error) => {
                console.log('Error fetching staff details:', error);
            });
    }, []);

    return (
        <>
            <div className="staff_details_container">
                <div><BackButton /></div>
                <div className="staff_data_for_admin">
                    <div className="staff_data_in_tabs">
                        {staffDetailsArray.map((staff, index) => (
                            <div key={index} className="staff_details_tabs">
                                <div className="staff_image_div" style={{ backgroundImage: `url(${baseURL}/${staff.image})` }}>
                                </div>
                                <div className="staff_data_div">
                                    <h4><b>Name:</b>&nbsp;{staff.first_name}&nbsp;{staff.last_name}</h4>
                                    <p><b>Department:</b>&nbsp;{staff.department_name}</p>
                                    <p><b>Email:</b>&nbsp;{staff.email}</p>
                                    <p><b>Mobile No:</b>&nbsp;{staff.contact_num}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

export default StaffDetailsInTabs;

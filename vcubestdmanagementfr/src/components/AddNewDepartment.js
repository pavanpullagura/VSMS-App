import { useState,useEffect,useContext } from "react";
import axios from "axios";
import './AddNewCourse.css';
import { userCont } from "../App";
import BackButton from "./BackButtonFunctionality";


function AddNewDepartment(){
    let [[user,setUser],[token, setToken],[isAuthenticated, setIsAuthenticated],[userType, setUserType]] = useContext(userCont);
    const [deptData, setDeptData] = useState({
        department_id: '',
        departmanet_name: ''
    });
    
    //const [cookies, setCookie] = useCookies(['csrftoken']);
    //const csrfToken = cookies.csrftoken;
    //console.log(cookies,csrfToken);
    //axios.defaults.headers.common['X-CSRF-Token'] = csrfToken;
    axios.defaults.headers.common['Authorization'] = `Token ${token}`;

    


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setDeptData({ ...deptData, [name]: value });
    };


    const handleNewDepartment = async (e) => {
        e.preventDefault();

        

        try {
            await axios.post('http://127.0.0.1:8000/adminuser/createdept/', deptData);
            alert('Department Added successfully!');
        } catch (error) {
            console.error('Error While Adding department', error);
        }
    };
    return (
        <>
        <div><BackButton /></div>
        <div className="addnewcoursediv">
            <div className="container_div_coursesadd">
                
               
            <form onSubmit={handleNewDepartment} className="course_form">
            <h1> Add New Department</h1>
            <input type="text"  name="department_id" value={deptData.department_id}  onChange={handleInputChange} placeholder="Department ID" required /> <br/>
            <input type="text"  name="departmanet_name" value={deptData.departmanet_name}  onChange={handleInputChange} placeholder="Department Name" required /> <br/>
            <button type="submit">Add Department</button>
            </form>
            </div>
        </div>
        </>
    );
}
export default AddNewDepartment;
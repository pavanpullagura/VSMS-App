import { useState,useEffect,useContext } from "react";
import axios from "axios";
import './AddNewCourse.css'
import { userCont } from "../App";
import { useCookies } from 'react-cookie';
import BackButton from "./BackButtonFunctionality";


function AddNewCourse(){
    let [[user,setUser],[token, setToken],[isAuthenticated, setIsAuthenticated],[userType, setUserType]] = useContext(userCont);
    const [courseData, setCourseData] = useState({
        courseName: '',
        description: '',
        course_image: ''
    });
    
    //const [cookies, setCookie] = useCookies(['csrftoken']);
    //const csrfToken = cookies.csrftoken;
    //console.log(cookies,csrfToken);
    //axios.defaults.headers.common['X-CSRF-Token'] = csrfToken;
    axios.defaults.headers.common['Authorization'] = `Token ${token}`;

    


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCourseData({ ...courseData, [name]: value });
    };
    const handleFileChange = (e) => {
        setCourseData({
            ...courseData,
            course_image: e.target.files[0]
        });
    };



    const handleRegister = async (e) => {
        e.preventDefault();

        

        try {
            await axios.post('http://127.0.0.1:8000/adminuser/addnewcourse/', courseData);
            alert('Course Added successfully!');
        } catch (error) {
            console.error('Error While Adding Course', error);
        }
    };
    return (
        <>
        <div><BackButton /></div>
        <div className="addnewcoursediv">
            <div className="container_div_coursesadd">
                
               
            <form onSubmit={handleRegister} className="course_form">
            <h1> Add New Course</h1>
            <input type="text"  name="courseName" value={courseData.courseName}  onChange={handleInputChange} placeholder="Course Name" required /> <br/>
            Course Image<input type="file"  name="course_image" value={courseData.course_image}  onChange={handleFileChange} placeholder="Course Image" required /> <br/>
            
            <textarea name="description" value={courseData.description} onChange={handleInputChange} placeholder="Add course Description" rows='10' cols='45' /><br/>
            <button type="submit">Add</button>
            </form>
            </div>
        </div>
        </>
    );
}
export default AddNewCourse;
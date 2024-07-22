import { useState,useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './RegisterStudent.css';
import BackButton from "./components/BackButtonFunctionality";


function RegisterStudent(){
    const [courses, setCourses] = useState([]);
    const [batches, setBatches] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [errors, setErrors] = useState('');
    const [studentData, setStudentData] = useState({
        studentFullName: '',
        username: '',
        email: '',
        contact_num: '',
        joining_date: '',
        course_details: '',
        batch_details: '',
        image: null
    });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/student/courses/');
                setCourses(response.data);
            } catch (error) {
                console.error('Error fetching courses', error);
                setErrors(error['message']);
            }
        };

        fetchCourses();
    }, []);

    useEffect(() => {
        const fetchBatches = async () => {
            if (selectedCourse) {
                try {
                    const response = await axios.get(`http://127.0.0.1:8000/student/batches/${selectedCourse}/`);
                    setBatches(response.data);
                } catch (error) {
                    console.error('Error fetching batches', error);
                    setErrors(error['message']);
                }
            }
        };

        fetchBatches();
    }, [selectedCourse]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setStudentData({ ...studentData, [name]: value });
    };

    const handleCourseChange = (e) => {
        setSelectedCourse(e.target.value);
        setStudentData({ ...studentData, course_details: e.target.value, batch_details: '' });
    };

    const handleBatchChange = (e) => {
        setStudentData({ ...studentData, batch_details: e.target.value });
    };

    const handleFileChange = (e) => {
        setStudentData({ ...studentData, image: e.target.files[0] });
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        for (const key in studentData) {
            formData.append(key, studentData[key]);
        }

        try {
            await axios.post('http://127.0.0.1:8000/student/register/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            alert('Student registered successfully!');
            navigate('/login');
        } catch (error) {
            console.error('Error registering student', error);
            if (error['response']['status'] === 500){
                setErrors('Some Thing Went Wrong.\nPlease try again later');
            }
        }
    };
    return (
        <>
        <div><BackButton /></div>
        <div className="registerstddiv">
            <div className="containers">
                <p>{errors}</p>
                <form onSubmit={handleRegister} className="stdregisterform">
                    <h1>Registration Form</h1>
                    <div className="form-group">
                        <input  type="text" name="studentFullName"  value={studentData.studentFullName} onChange={handleInputChange} placeholder="Full Name"  required  />
                        <input type="text"  name="username"  value={studentData.username} onChange={handleInputChange} placeholder="Username"  required />
                    </div>
                    <div className="form-group">
                        <input  type="email"  name="email" value={studentData.email} onChange={handleInputChange} placeholder="Email" required  />
                        <input type="text"  name="contact_num" value={studentData.contact_num}  onChange={handleInputChange} placeholder="Contact Number"  required />
                    </div>
                    <div className="form-group">
                        
                        <select name="course_details" value={selectedCourse} onChange={handleCourseChange}  className="select_course" required>
                            <option value="">Select Course</option>
                            {courses.map(course => (
                                <option key={course.id} value={course.id}>{course.courseName}</option>
                            ))}
                        </select>
                        <select name="batch_details" value={studentData.batch_details} onChange={handleBatchChange} className="select_batch" required>
                            <option value="">Select Batch</option>
                            {batches.map(batch => (
                                <option key={batch.id} value={batch.id}>{batch.Batch_name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group input_wrapper">
                        <input type="date"  name="joining_date" value={studentData.joining_date} onChange={handleInputChange} placeholder="joining date" className="input_field" required  />
                        <label className='input_label'>Joining Date</label>
                        <input type="file" name="image" onChange={handleFileChange} />
                    </div>
                    <button type="submit" className="submit-btn">Register</button>
                </form>
            </div>
        </div>
        </>
    );
}
export default RegisterStudent;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './EnrollmentForm.css';

function EnrollForm(){
    const [courses, setCourses] = useState([]);
    const initialFormData = {
        studentFirstName: '',
        studentLastName: '',
        dateOfBirth: '',
        graduation: '',
        specialization: '',
        passedOutYear: '',
        address: '',
        gender: '',
        email: '',
        contact_num: '',
        selectCourse: '',
        joiningMonthPreference: ''
      };
    const [formData, setFormData] = useState({ ...initialFormData });

    const [specializations, setSpecializations] = useState([]);
    const [isEnrolling, setIsEnrolling] = useState(false);
    const [enrollmentSuccess, setEnrollmentSuccess] = useState(false);

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/staff/allcourses/').then(response => {
            setCourses(response.data);
            console.log(courses);
        }).catch(error => {
            console.error('Error fetching courses:', error);
        });
    }, []);


    const handleGraduationChange = (e) => {
        const graduation = e.target.value;
        setFormData({ ...formData, graduation });
        switch (graduation) {
            case 'B.Tech':
                setSpecializations(['CSE','IT', 'EEE', 'ECE', 'Civil Engineering', 'Mechanical Engineering', 'Electrical Engineering', 'Aerospace Engineering', 'Biotechnology', 'Chemical Engineering', 'Textile Engineering', 'Automobile Engineering', 'BME', 'ENE', 'Industrial Engineering']);
                break;
            case 'B.E':
                setSpecializations(['Computer Engineering (CE)','Electronics and Communication Engineering (ECE)', 'Mechanical Engineering (ME)', 'Electrical Engineering', 'Aerospace Engineering','Civil Engineering','Biomedical Engineering (BME)', 'Chemical Engineering', 'Textile Engineering', 'Automobile Engineering', 'BME', 'ENE', 'Industrial Engineering','Robotics and Automation Engineering (RAE)'])
            case 'B.Sc':
                setSpecializations(['MPCS', 'MSCS', 'MPC', 'BZC', 'MEC']);
                break;
            case 'B.Com':
                setSpecializations(['Computers', 'Accounting and Finance', 'Management', 'Marketing', 'Human Resource Management', 'Financial Management', 'Cost and Management Accounting', 'Banking and Insurance']);
                break;
            default:
                setSpecializations([]);
                break;
        }
      };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsEnrolling(true);
        axios.post('http://127.0.0.1:8000/staff/enrollments/', formData)
        .then(response => {
            console.log('Enrollment successful:', response.data);
            setIsEnrolling(false);
            setEnrollmentSuccess(true); 
            setFormData({ ...initialFormData }); // Handle success (e.g., show a success message)
            setTimeout(() => {
                setEnrollmentSuccess(false);
              }, 3000); // Reset success message after 3 seconds
            
            
        })
        .catch(error => {
            console.error('Error during enrollment:', error);
        });
    };

    return (
        <div className='enrollment_form_div'>
            <form onSubmit={handleSubmit} className='enrollment_form_for_new_students'>
                <div className='enroll_form_input_divs'>
                    <input type="text" name="studentFirstName" value={formData.studentFirstName} className='enroll_form_input_fields' onChange={handleChange} required />
                    <label className='enroll_form_labels' >First Name</label>
                </div>
                <div className='enroll_form_input_divs'>
                    <input type="text" name="studentLastName" value={formData.studentLastName} className='enroll_form_input_fields'  onChange={handleChange} required />
                    <label className='enroll_form_labels' >Last Name</label>
                </div>
                <div className='enroll_form_input_divs'>
                    <input type="date" name="dateOfBirth" value={formData.dateOfBirth} className='enroll_form_input_fields'  onChange={handleChange} required />
                    <label className='enroll_form_labels' >Date of Birth</label>
                </div>
                <div className='enroll_form_input_divs'>
                    <select name="graduation" value={formData.graduation} className='enroll_form_select_fields'  onChange={handleGraduationChange} required>
                    <option value="">Select</option>
                    <option value="B.Tech">B.Tech</option>
                    <option value="B.E">B.E</option>
                    <option value="B.Sc">B.Sc</option>
                    <option value="B.Com">B.Com</option>
                    <option value="B.A">B.A</option>
                    </select>
                    <label className='enroll_form_labels' >Graduation</label>
                </div>
                <div className='enroll_form_input_divs'>
                    <select name="specialization" value={formData.specialization} className='enroll_form_select_fields'  onChange={handleChange} required>
                    <option value="">Select</option>
                    {specializations.map((spec, index) => (
                        <option key={index} value={spec}>{spec}</option>
                    ))}
                    </select>
                    <label className='enroll_form_labels' >Specialization</label>
                </div>
                <div className='enroll_form_input_divs'>
                    <input type="number" name="passedOutYear" value={formData.passedOutYear} className='enroll_form_input_fields'  onChange={handleChange} required />
                    <label className='enroll_form_labels' >Passed Out Year</label>
                </div>
                <div className='enroll_form_input_divs'>
                    <textarea name="address" value={formData.address} onChange={handleChange} className='enroll_form_input_fields'  required></textarea>
                    <label className='enroll_form_labels' >Address</label>
                </div>
                <div className='enroll_form_input_divs'>
                    <select name="gender" value={formData.gender} onChange={handleChange} className='enroll_form_select_fields'  required>
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    </select>
                    <label className='enroll_form_labels' >Gender</label>
                </div>
                <div className='enroll_form_input_divs'>
                    <input type="email" name="email" value={formData.email} className='enroll_form_input_fields'  onChange={handleChange} required />
                    <label className='enroll_form_labels' >Email</label>
                </div>
                <div className='enroll_form_input_divs'>
                    <input type="text" name="contact_num" value={formData.contact_num} className='enroll_form_input_fields'  onChange={handleChange} required />
                    <label className='enroll_form_labels' >Contact Number</label>
                </div>
                <div className='enroll_form_input_divs'>
                    <select name="selectCourse" value={formData.selectCourse} className='enroll_form_select_fields'  onChange={handleChange} required>
                    <option value="">Select</option>
                    {courses.map((course) => (
                        <option key={course.id} value={course.id}>{course.courseName}</option>
                    ))}
                    </select>
                    <label className='enroll_form_labels' >Select Course</label>
                </div>
                <div className='enroll_form_input_divs'>
                    <select name="joiningMonthPreference" value={formData.joiningMonthPreference} className='enroll_form_select_fields'  onChange={handleChange} required>
                    <option value="">Select</option>
                    <option value="this month">This Month</option>
                    <option value="next month">Next Month</option>
                    <option value="after 1 month">After 1 Month</option>
                    <option value="after 2 months">After 2 Months</option>
                    </select>
                    <label className='enroll_form_labels' >Joining Month Preference</label>
                </div>
                <button type="submit" className={`enrolling-button ${isEnrolling ? 'enrolling' : ''}`} id='enroll_btn' >
                    <span>Enroll</span>
                </button>
            </form>
            {enrollmentSuccess && (
                <div className="success-popup">
                <p>Enrolled Successfully</p>
                </div>
            )}

        </div>
    );
}

export default EnrollForm;

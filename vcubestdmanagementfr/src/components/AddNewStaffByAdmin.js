import './AddNewStaffByAdmin.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BackButton from './BackButtonFunctionality';

const AddNewStaffByAdmin = () => {
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    contact_num: '',
    joining_date: '',
    qualification: '',
    address: '',
    department: '',
    course: '',
    image: null,
    gender: ''
  });

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/adminuser/departments/')
      .then(response => setDepartments(response.data))
      .catch(error => console.error(error));

    axios.get('http://127.0.0.1:8000/adminuser/courses/')
      .then(response => setCourses(response.data))
      .catch(error => console.error(error));
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleImageChange = e => {
    setFormData({
      ...formData,
      image: e.target.files[0]
    });
  };

  const handleSubmit = e => {
    e.preventDefault();
    const form = new FormData();
    for (const key in formData) {
      form.append(key, formData[key]);
    }

    axios.post('http://127.0.0.1:8000/adminuser/register/', form)
      .then(response => alert('Registration successful'))
      .catch(error => console.error(error));
  };

  return (
    <>
    <div><BackButton /></div>
      <div className="staff_registration_main_div">
        <div className='staff_registration_sub_div' >
          <h2>Register Staff</h2>
          <form onSubmit={handleSubmit}>
            {/* Form fields */}
            <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} placeholder="First Name" /><br/>
            <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} placeholder="Last Name" /><br/>
            <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="Username" /><br/>
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" /><br/>
            <input type="text" name="contact_num" value={formData.contact_num} onChange={handleChange} placeholder="Contact Number" /><br/>
            <input type="date" name="joining_date" value={formData.joining_date} onChange={handleChange} placeholder="Joining Date" /><br/>
            <input type="text" name="qualification" value={formData.qualification} onChange={handleChange} placeholder="Qualification" /><br/>
            <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Address" /><br/>
            <select name="department" value={formData.department} onChange={handleChange}>
              <option value="">Select Department</option>
              {departments.map(dept => (
                <option key={dept.department_id} value={dept.department_id}>{dept.departmanet_name}</option>
              ))}
            </select><br/>
            <select name="course" value={formData.course} onChange={handleChange}>
              <option value="">Select Course</option>
              {courses.map(course => (
                <option key={course.id} value={course.id}>{course.courseName}</option>
              ))}
            </select><br/>
            <select name="gender" value={formData.gender} onChange={handleChange}>
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="others">Others</option>
            </select><br/>
            <input type="file" name="image" onChange={handleImageChange} /><br/>
            <button type="submit">Register</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddNewStaffByAdmin;

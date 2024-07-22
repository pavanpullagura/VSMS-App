import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import './AdminStudentsView.css';
import { userCont } from "../App";
import BackButton from "./BackButtonFunctionality";

const StudentDetailsView = () => {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('');
  let [[user, setUser], [token, setToken], [isAuthenticated, setIsAuthenticated], [userType, setUserType]] = useContext(userCont);

  useEffect(() => {
    // Fetch all students
    axios.get(`http://127.0.0.1:8000/staff/students/`, {
      headers: {
        'Authorization': 'Token ' + token
      }
    }).then(response => setStudents(response.data))
      .catch(error => console.error(error));

    // Fetch all courses
    axios.get(`http://127.0.0.1:8000/staff/allcourses/`, {
      headers: {
        'Authorization': 'Token ' + token
      }
    }).then(response => setCourses(response.data))
      .catch(error => console.error(error));

    // Fetch all batches
    axios.get(`http://127.0.0.1:8000/staff/allbatches/`, {
      headers: {
        'Authorization': 'Token ' + token
      }
    }).then(response => {
      setBatches(response.data);
      console.log(batches,response.data);
    })
      .catch(error => console.error(error));
  }, [token]);

  useEffect(() => {
    filterStudents();
  }, [selectedCourse, selectedBatch, students]);

  const filterStudents = () => {
    let filtered = students;
    console.log(filtered,students,selectedCourse,selectedBatch);
    filtered.filter(s=>{
      console.log(s.course_details === selectedCourse);
    });
    if (selectedCourse) {
      filtered = filtered.filter(student => student.course_details === parseInt(selectedCourse));
      console.log(filtered,students);
    }
    if (selectedBatch) {
      filtered = filtered.filter(student => student.batch_details === parseInt(selectedBatch));
      console.log(filtered);
    }
    setFilteredStudents(filtered);
  };

  const getCourseName = (courseId) => {
    const course = courses.find(course => course.id === courseId);
    return course ? course.courseName : 'N/A';
  };

  const getBatchName = (batchId) => {
    const batch = batches.find(batch => batch.id === batchId);
    return batch ? batch.Batch_name : 'N/A';
  };
  return (
    <>
      <div><BackButton /></div>
      <div className="filter_container">
        <select onChange={(e) => setSelectedCourse(e.target.value)} value={selectedCourse}>
          <option value="">All Courses</option>
          {courses.map(course => (
            <option key={course.id} value={course.id}>{course.courseName}</option>
          ))}
        </select>
        <select onChange={(e) => setSelectedBatch(e.target.value)} value={selectedBatch}>
          <option value="">All Batches</option>
          {batches.map(batch => (
            <option key={batch.id} value={batch.id}>{batch.Batch_name}</option>
          ))}
        </select>
      </div>
      <div className='students-table-div'>
        <table>
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Course</th>
              <th>Batch</th>
              <th>Fee Clearance</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map(student => (
              <tr key={student.id}>
                <td>{student.studentFullName}</td>
                <td>{getCourseName(student.course_details)}</td>
                <td>{getBatchName(student.batch_details)}</td>
                <td>{student.fee_cleared ? (
                                    <span style={{ color: 'green' }}>✔️</span>
                                ) : (
                                    <span style={{ color: 'red' }}>❌</span>
                                )}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default StudentDetailsView;

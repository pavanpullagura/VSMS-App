// StudentsTable.js
import React, { useState, useEffect,useContext } from 'react';
import axios from 'axios';
import { userCont } from '../App';
import { Link } from 'react-router-dom';
import BackButton from './BackButtonFunctionality';
import './AllStudentsDetails.css';

const AllStudentsTable = () => {
  let [students,setStudents] = useState([]);
  let [courses,setCourses] = useState([]);
  let [[user, setUser], [token, setToken], [isAuthenticated, setIsAuthenticated],[userType, setUserType]]= useContext(userCont);
  let [batches,setBatches] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/staff/allstudents/',{
          headers:{
            'Authorization':'Token '+token
          }
        });
        setStudents(response.data['stdData']);
        setCourses(response.data['crs']);
        setBatches(response.data['bts']);
      } catch (error) {
        console.error(error);
      }
    };

    fetchStudents();
  }, []);

  const getCourseName = (courseId) => {
    const course = courses.find(course => course.id === courseId);
    return course ? course.courseName : 'N/A';
  };

  const getBatchName = (batchId) => {
    const batch = batches.find(batch => batch.id === batchId);
    return batch ? batch.Batch_name : 'N/A';
  };
  const getBatchCourseName = (batchId) => {
    const batch = batches.find(batch => batch.id === batchId);
    if (batch) {
      const course = courses.find(course => course.id === batch.course);
      return course ? course.courseName : 'N/A';
    }
    return 'N/A';
  };
  return (
    <>
    <div  className="all-students-table">
      <div><BackButton  className="back-button" /></div>
      <table className='std_all_performance_table'>
        <thead>
          <tr>
            <th className='th_at_std_perform'>Student Name</th>
            <th className='th_at_std_perform'>Course Name</th>
            <th className='th_at_std_perform'>Batch Name</th>
            <th className='th_at_std_perform'>Weekly Tests</th>
            <th className='th_at_std_perform'>Mock Details</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td className='td_at_std_perform'>{student.studentFullName}</td>
              <td className='td_at_std_perform'>{getBatchCourseName(student.batch_details)}</td>
              <td className='td_at_std_perform'>{getBatchName(student.batch_details)}</td>

              <td className='td_at_std_perform'>
                <Link to={`/weekly_tests/${student.username}`}>View Weekly Tests</Link>
              </td>
              <td className='td_at_std_perform'>
                <Link to={`/mock_interviews/${student.username}`}>View Mock Interviews</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </>
  );
};

export default AllStudentsTable;
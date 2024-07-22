// Students.js

import React, { useState, useEffect,useContext } from 'react';
import { useParams,Link } from 'react-router-dom';
import axios from 'axios';
import { userCont } from './App';

const Students = () => {
  const { course, batchId } = useParams();
  const [students, setStudents] = useState([]);
  const [averageAttendance, setAverageAttendance] = useState(0);
  let [[user, setUser], [token, setToken], [isAuthenticated, setIsAuthenticated],[userType, setUserType]]= useContext(userCont);
  

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/staff/batches/${course}/${batchId}`, {},{
          
          headers: { "Authorization": 'Token '+token }
        });
        
        setStudents(response.data);
        console.log(response.data);
        console.log('Students DAta Array',students);
      } catch (error) {
        console.error('Error fetching students', error);
      }
    };

    fetchStudents();
  }, [batchId]);

  useEffect(() => {
    const calculateAverageAttendance = async () => {
      let totalAttendance = 0;
      let presentDays = 0;

      for (const student of students) {
        const response = await axios.get(`http://127.0.0.1:8000/staff/std/attendance/${student.id}/`, {
          headers: { Authorization: `Token ${token}` }
        });
        //console.log(response.data.student);
        //totalAttendance += response.data.student.attendances.length;
        //presentDays += response.data.student.attendances.filter(att => att.status).length;
      }

      //setAverageAttendance((presentDays / totalAttendance) * 100 || 0);
    };
/*
    if (students.length > 0) {
      calculateAverageAttendance();
    }*/
  }, [students]);

  return (
    <div>
      <h2>{course} - Batch {batchId}</h2>
      <h3>Average Attendance: {averageAttendance.toFixed(2)}%</h3>
      <ul>
        {students.map(student => (
          <li key={student.id}><Link to={`/std/attendance/${course}/${batchId}/${student.id}`}>{student.studentFullName}</Link></li>
        ))}
      </ul>
    </div>
  );
};

export default Students;

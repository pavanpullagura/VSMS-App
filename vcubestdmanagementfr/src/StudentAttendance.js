import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './KnowStudentAttendanceByStaff.css';
import { userCont } from './App';

const StudentAttendance = () => {
    const [students, setStudents] = useState([]);
    const [batch, setBatch] = useState('');
    let [[user, setUser], [token, setToken], [isAuthenticated, setIsAuthenticated],[userType, setUserType]]= useContext(userCont);
    const { courseId } = useParams();
    const [batches, setBatches] = useState([]);

    useEffect(() => {
        fetch(`http://127.0.0.1:8000/staff/courses/${courseId}/batches`) // Replace with your API endpoint
            .then(response => response.json())
            .then(data => setBatches(data));
    }, [courseId]);
    console.log(batches);
    console.log('course id',courseId);

    useEffect(() => {
        if (batch) {
            axios.get(`http:127.0.0.1:8000/staff/students/${batch}/`, {
                headers: {
                    Authorization: `Token ${token}`
                }
            })
            .then(response => {
                setStudents(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the student data!', error);
            });
        }
    }, [batch]);

    /* To GET & Display student Attendance */
    let year=2024;
        let month=3;
        KnowStdAttendanceByStaff(year,month); 
    const KnowStdAttendanceByStaff = ({ year, month }) => {
        const [attendanceData, setAttendanceData] = useState([]);
        
    
        useEffect(() => {
            axios.get(`http://127.0.0.1:8000/staff/students/attendance/${year}/${month}/`,{
                headers:{
                    "Authorization":'Token '+token
                }
            })
            .then(response => {
                setAttendanceData(response.data);
            })
            .catch(error => {
                console.error("There was an error fetching the attendance data!", error);
            });
        }, [year, month]);
        console.log('Attendance data',attendanceData);
        ;
        return(
            <div>
            {attendanceData.map(student => (
              <div key={student.id}>
                <h3>{student.studentFullName}</h3>
                <p>{student.email}</p>
                
                <p>Contact: {student.contact_num}</p>
                <div>
                  {student.attendance.map((status, index) => (
                    <span key={index} className={`attendance-mark ${status === '✔' ? 'present' : 'absent'}`}>
                      {status}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );
    }
    return (
        <>
        <div>
            <h1>Batches for Course ID: {courseId}</h1>
    
        </div>
       
        <div>
            <h1>Student Attendance</h1>
            <select onChange={(e) => setBatch(e.target.value)}>
                <option value="">Select Batch</option>
                {batches.map(b=>(
                    <option value={b.id}>{b.Batch_name}</option>
                ))}
                {/* Add options dynamically from API */}
            </select>
            <div>
                {students.map(student => (
                    <div key={student.id}>
                        <h2>{student.studentFullName} {student.email}<p>Contact: {student.contact_num}</p></h2>
                        {/* Fetch and display attendance data for each student */}
                    </div>
                ))}
            </div>
        </div>
      
        </>
    );
};

export default StudentAttendance;

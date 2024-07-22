import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { userCont } from '../App';
import BackButton from './BackButtonFunctionality';

const AllStudentPerformance = () => {
  const [[user, setUser], [token, setToken], [isAuthenticated, setIsAuthenticated], [userType, setUserType]] = useContext(userCont);
  const [students, setStudents] = useState([]);
  const [weeklyTests, setWeeklyTests] = useState({});
  const [mockInterviews, setMockInterviews] = useState({});

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const studentsResponse = await axios.get('http://127.0.0.1:8000/staff/allstudents/', {
          headers: {
            'Authorization': 'Token ' + token
          }
        });
        setStudents(studentsResponse.data);
        console.log(students);
      } catch (error) {
        console.error(error);
      }
    };

    fetchStudents();
  }, [token]);

  useEffect(() => {
    const fetchPerformanceData = async () => {
      try {
        students.forEach(async (student) => {
          const weeklyTestsResponse = await axios.get(`http://127.0.0.1:8000/staff/student_weekly_tests/?student_id=${student.id}`, {
            headers: {
              'Authorization': 'Token ' + token
            }
          });
          setWeeklyTests((prevWeeklyTests) => ({ ...prevWeeklyTests, [student.id]: weeklyTestsResponse.data }));

          const mockInterviewsResponse = await axios.get(`http://127.0.0.1:8000/staff/student_mock_interviews/?student_id=${student.id}`, {
            headers: {
              'Authorization': 'Token ' + token
            }
          });
          setMockInterviews((prevMockInterviews) => ({ ...prevMockInterviews, [student.id]: mockInterviewsResponse.data }));
        });
      } catch (error) {
        console.error(error);
      }
    };

    fetchPerformanceData();
  }, [students, token]);

  return (
    <>
    <div><BackButton /></div>
    <div>
      <h2>Performance Reports</h2>
      {students.map((student) => (
        <div key={student.id}>
          <h3>{student.name}'s Performance Reports</h3>
          <h4>Weekly Tests</h4>
          <table>
            <thead>
              <tr>
                <th>Test Date</th>
                <th>Obtained Marks</th>
                <th>Total Marks</th>
              </tr>
            </thead>
            <tbody>
              {weeklyTests[student.id] && weeklyTests[student.id].map((test) => (
                <tr key={test.id}>
                  <td>{test.test_date}</td>
                  <td>{test.obtained_marks}</td>
                  <td>{test.total_marks}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h4>Mock Interviews</h4>
          <table>
            <thead>
              <tr>
                <th>Interview Date</th>
                <th>Obtained Score</th>
                <th>Total Score</th>
              </tr>
            </thead>
            <tbody>
              {mockInterviews[student.id] && mockInterviews[student.id].map((interview) => (
                <tr key={interview.id}>
                  <td>{interview.interview_date}</td>
                  <td>{interview.obtained_score}</td>
                  <td>{interview.total_score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
    </>
  );
};

export default AllStudentPerformance;
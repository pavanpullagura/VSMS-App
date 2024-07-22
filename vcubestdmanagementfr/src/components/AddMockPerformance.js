import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { userCont } from '../App';
import BackButton from './BackButtonFunctionality';

const AddMockInterviewPerformance = () => {
  const [[user, setUser], [token, setToken], [isAuthenticated, setIsAuthenticated], [userType, setUserType]] = useContext(userCont);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [interviewDate, setInterviewDate] = useState('');
  const [obtainedScore, setObtainedScore] = useState('');
  const [totalScore, setTotalScore] = useState('');
  const [averageScore, setAverageScore] = useState('');

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/staff/all_students/`, {
          headers: {
            'Authorization': 'Token ' + token
          }
        });
        setStudents(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchStudents();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAverageScore((obtainedScore/totalScore)*100);
    try {
      await axios.post(`http://127.0.0.1:8000/staff/add_mock_interview_performance/`, {
        student: selectedStudent,
        interview_date: interviewDate,
        obtained_score: obtainedScore,
        total_score: totalScore,
        average_score: averageScore
      }, {
        headers: {
          'Authorization': 'Token ' + token
        }
      });
      alert('Performance added successfully');
    } catch (error) {
      console.error(error);
      alert('Failed to add performance');
    }
  };

  return (
    <div>
      <div><BackButton /></div>
      <h2>Add Mock Interview Performance</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Student:</label>
          <select value={selectedStudent} onChange={(e) => setSelectedStudent(e.target.value)} required>
            <option value="">Select Student</option>
            {students.map(student => (
              <option key={student.id} value={student.id}>{student.studentFullName}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Interview Date:</label>
          <input type="date" value={interviewDate} onChange={(e) => setInterviewDate(e.target.value)} required />
        </div>
        <div>
          <label>Obtained Score:</label>
          <input type="number" value={obtainedScore} onChange={(e) => setObtainedScore(e.target.value)} required />
        </div>
        <div>
          <label>Total Score:</label>
          <input type="number" value={totalScore} onChange={(e) => setTotalScore(e.target.value)} required />
        </div>
        <button type="submit">Add Performance</button>
      </form>
    </div>
  );
};

export default AddMockInterviewPerformance;

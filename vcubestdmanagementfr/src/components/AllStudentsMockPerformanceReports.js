// MockInterviewsTable.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BackButton from './BackButtonFunctionality';

const MockInterviewsTable = () => {
  const [mockInterviews, setMockInterviews] = useState([]);

  useEffect(() => {
    const fetchMockInterviews = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/staff/student_mock_interviews/');
        setMockInterviews(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchMockInterviews();
  }, []);

  return (
    <>
    <div><BackButton /></div>
    <table>
      <thead>
        <tr>
          <th>Student Name</th>
          <th>Course Name</th>
          <th>Batch Name</th>
          <th>Interview Date</th>
          <th>Obtained Score</th>
          <th>Total Score</th>
        </tr>
      </thead>
      <tbody>
        {mockInterviews.map((interview) => (
          <tr key={interview.id}>
            <td>{interview.student.name}</td>
            <td>{interview.student.course.name}</td>
            <td>{interview.student.batch.name}</td>
            <td>{interview.interview_date}</td>
            <td>{interview.obtained_score}</td>
            <td>{interview.total_score}</td>
          </tr>
        ))}
      </tbody>
    </table>
    </>
  );
};

export default MockInterviewsTable;
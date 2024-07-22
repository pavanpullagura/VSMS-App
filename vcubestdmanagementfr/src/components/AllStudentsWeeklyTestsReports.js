// WeeklyTestsTable.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BackButton from './BackButtonFunctionality';

const WeeklyTestsTable = () => {
  const [weeklyTests, setWeeklyTests] = useState([]);

  useEffect(() => {
    const fetchWeeklyTests = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/staff/student_weekly_tests/');
        setWeeklyTests(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchWeeklyTests();
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
          <th>Test Date</th>
          <th>Obtained Marks</th>
          <th>Total Marks</th>
        </tr>
      </thead>
      <tbody>
        {weeklyTests.map((test) => (
          <tr key={test.id}>
            <td>{test.student.name}</td>
            <td>{test.student.course.name}</td>
            <td>{test.student.batch.name}</td>
            <td>{test.test_date}</td>
            <td>{test.obtained_marks}</td>
            <td>{test.total_marks}</td>
          </tr>
        ))}
      </tbody>
    </table>
    </>
  );
};

export default WeeklyTestsTable;
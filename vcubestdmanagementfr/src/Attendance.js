import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Attendance.css';

function Attendance(){
  const [attendanceData, setAttendanceData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/attendance/`);
        setAttendanceData(response.data);
      } catch (error) {
        console.error("There was an error fetching the attendance data!", error);
      }
    };

    fetchAttendance();
  }, []);

  const filterByMonth = (data, month) => {
    return data.filter(item => new Date(item.date).getMonth() + 1 === month);
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(parseInt(event.target.value));
  };

  const renderAttendance = (data) => {
    return data.map((item, index) => (
      <tr key={index}>
        <td>{item.date}</td>
        <td>{item.status}</td>
      </tr>
    ));
  };

  return (
    <div className="Attendance">
      <h1>Student Attendance Details</h1>
      <label>
        Select Month:
        <select value={selectedMonth} onChange={handleMonthChange}>
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              {new Date(0, i).toLocaleString('default', { month: 'long' })}
            </option>
          ))}
        </select>
      </label>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {renderAttendance(filterByMonth(attendanceData, selectedMonth))}
        </tbody>
      </table>
    </div>
  );
};

export default Attendance;

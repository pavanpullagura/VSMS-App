
import React, { useState, useEffect,useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './AttendanceSelfStd.css';
import { userCont } from '../App';
import BackButton from './BackButtonFunctionality';

const SelfAttendance = () => {
    const { stdid, year, month } = useParams();
    const [attendanceData, setAttendanceData] = useState([]);
    const [studentData, setStudentData] = useState({});
    const [selectedYear, setSelectedYear] = useState(year || new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(month || new Date().getMonth() + 1);
    let [[user, setUser], [token, setToken], [isAuthenticated, setIsAuthenticated],[userType, setUserType]] = useContext(userCont);

    useEffect(() => {
        fetchAttendanceData(stdid, selectedYear, selectedMonth);
    }, [stdid, selectedYear, selectedMonth]);

    const fetchAttendanceData = async (stdId, year, month) => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/student/attendance/${stdId}/${year}/${month}/`, {
                headers: {
                    Authorization: `Token ${token}`
                }
            });
            setStudentData(response.data.student);
            setAttendanceData(response.data.attendance);
            console.log(response.data.attendance);
        } catch (error) {
            console.error('Error fetching attendance data', error);
        }
    };

    const handleMonthChange = (e) => {
        setSelectedMonth(e.target.value);
    };

    const handleYearChange = (e) => {
        setSelectedYear(e.target.value);
    };

    return (
        <>
        <div><BackButton /></div>
        <div className='std_selfattendancediv'>
            <h1>Attendance</h1>
            <h2>Name: {studentData.studentFullName}</h2>
            <h2>Mobile Number: {studentData.contact_num}</h2>
            <h2>Email ID: {studentData.email}</h2>
            <div className='year_month_details'>
                <label>
                    Year:
                    <select value={selectedYear} onChange={handleYearChange}>
                        {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map(y => (
                            <option key={y} value={y}>{y}</option>
                        ))}
                    </select>
                </label>
                <label>
                    Month:
                    <select value={selectedMonth} onChange={handleMonthChange}>
                        {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                            <option key={m} value={m}>{m}</option>
                        ))}
                    </select>
                </label>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {attendanceData.map(record => (
                        <tr key={record.date}>
                            <td>{record.date}</td>
                            <td>{record.status === 'PRESENT' ? '✔️' : '❌'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        </>
    );
};

export default SelfAttendance;
/*
// src/components/Attendance.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import './Attendance.css';

const Attendance = () => {
    const { student_id } = useParams();
    const [attendanceData, setAttendanceData] = useState([]);
    const [overallAttendance, setOverallAttendance] = useState(null);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

    useEffect(() => {
        fetchAttendanceData(student_id, selectedYear, selectedMonth);
    }, [student_id, selectedYear, selectedMonth]);

    const fetchAttendanceData = async (studentId, year, month) => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/attendance/${studentId}/${year}/${month}/`, {
                headers: {
                    Authorization: `Token ${localStorage.getItem('token')}`
                }
            });
            setAttendanceData(response.data.attendance);
            calculateOverallAttendance(response.data.attendance);
        } catch (error) {
            console.error('Error fetching attendance data', error);
        }
    };

    const calculateOverallAttendance = (data) => {
        const totalDays = data.length;
        const presentDays = data.filter(a => a.status === 'PRESENT').length;
        const attendancePercentage = (presentDays / totalDays) * 100;
        setOverallAttendance(attendancePercentage);
    };

    const handleMonthChange = (e) => {
        setSelectedMonth(e.target.value);
    };

    const handleYearChange = (e) => {
        setSelectedYear(e.target.value);
    };

    const chartData = {
        labels: ['Present', 'Absent'],
        datasets: [{
            data: [
                attendanceData.filter(a => a.status === 'PRESENT').length,
                attendanceData.filter(a => a.status === 'ABSENT').length
            ],
            backgroundColor: ['#36A2EB', '#FF6384']
        }]
    };

    return (
        <div>
            <h1>Attendance</h1>
            <div>
                <label>
                    Year:
                    <select value={selectedYear} onChange={handleYearChange}>
                        {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map(y => (
                            <option key={y} value={y}>{y}</option>
                        ))}
                    </select>
                </label>
                <label>
                    Month:
                    <select value={selectedMonth} onChange={handleMonthChange}>
                        {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                            <option key={m} value={m}>{m}</option>
                        ))}
                    </select>
                </label>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {attendanceData.map(record => (
                        <tr key={record.date}>
                            <td>{record.date}</td>
                            <td>{record.status === 'PRESENT' ? '✔️' : '❌'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {overallAttendance !== null && (
                <div>
                    <h2>Overall Attendance: {overallAttendance.toFixed(2)}%</h2>
                    <div style={{ background: overallAttendance > 70 ? 'green' : overallAttendance > 45 ? 'orange' : 'red' }}>
                        {overallAttendance.toFixed(2)}%
                    </div>
                </div>
            )}
            <Pie data={chartData} />
        </div>
    );
};

export default Attendance;
*/
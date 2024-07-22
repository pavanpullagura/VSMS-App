import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { userCont } from './App';
import './KnowStudentAttendanceByStaff.css';
import BackButton from './components/BackButtonFunctionality';

const KnowStudentAttendanceByStaff = () => {
    const { batch_id, courseId } = useParams();
    const [students, setStudents] = useState([]);
    const [attendanceDates, setAttendanceDates] = useState([]);
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [year, setYear] = useState(new Date().getFullYear());
    const [[user, setUser], [token, setToken], [isAuthenticated, setIsAuthenticated],[userType, setUserType]] = useContext(userCont);

    useEffect(() => {
        if (batch_id) {
            fetchAttendanceData(batch_id);
        }
    }, [batch_id, month, year]); 

    const fetchAttendanceData = async (batchId) => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/staff/attendance/${batchId}/`, {
                params: {
                    month: month,
                    year: year
                },
                headers: {
                    Authorization: `Token ${token}`
                }
            });

            const fetchedStudents = response.data;
            setStudents(fetchedStudents);

            // Extract unique attendance dates
            const dates = new Set();
            fetchedStudents.forEach(student => {
                student.attendances.forEach(attendance => {
                    dates.add(attendance.date);
                });
            });
            setAttendanceDates(Array.from(dates).sort());
        } catch (error) {
            console.error('Error fetching attendance data', error);
        }
    };

    return (
        <div>
            <div className='select_date_div'>
                <h1>Student Attendance</h1>
                
                <div><BackButton /></div>
                <div className="month-year-selector">
                    <label>Month: </label>
                    <select value={month} onChange={e => setMonth(e.target.value)}>
                        {Array.from({ length: 12 }, (_, index) => (
                            <option key={index + 1} value={index + 1}>
                                {new Date(0, index).toLocaleString('default', { month: 'long' })}
                            </option>
                        ))}
                    </select>
                    <label>Year: </label>
                    <select value={year} onChange={e => setYear(e.target.value)}>
                        {[...Array(10).keys()].map(y => (
                            <option key={y + 2020} value={y + 2020}>{y + 2020}</option>
                        ))}
                    </select>
                    <button onClick={() => fetchAttendanceData(batch_id)}>Fetch Attendance</button>
                </div>
            </div>
            <div className='attendance-container'>
                <div className="table-responsive">
                    <table className='attendance_table_for_staff'>
                        <thead>
                            <tr>
                                <th className='table_head_att'>Student ID</th>
                                <th className='table_head_att'>Name</th>
                                <th className='table_head_att'>Contact Number</th>
                                <th className='table_head_att'>Email</th>
                                {attendanceDates.map(date => (
                                    <th key={date}  className='table_head_att'>{date}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {students.map(stdData => (
                                <tr key={stdData.student.id}>
                                    <td className='table_data_att'>{stdData.student.id}</td>
                                    <td className='table_data_att'>{stdData.student.studentFullName}</td>
                                    <td className='table_data_att'>{stdData.student.contact_num}</td>
                                    <td className='table_data_att'>{stdData.student.email}</td>
                                    {attendanceDates.map(date => {
                                        const attendance = stdData.attendances.find(a => a.date === date);
                                        return (
                                            <td key={date} className='table_data_att'>
                                                {attendance ? (
                                                    attendance.status === 'PRESENT' ? '✔️' : '❌'
                                                ) : (
                                                    <span className="red-cross">❌</span>
                                                )}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default KnowStudentAttendanceByStaff;

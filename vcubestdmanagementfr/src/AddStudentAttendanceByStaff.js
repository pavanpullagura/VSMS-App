import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { userCont } from './App';
import './KnowStudentAttendanceByStaff.css';
import BackButton from './components/BackButtonFunctionality';

const AddStudentAttendanceByStaff = () => {
    const { batch_id, courseId } = useParams();
    const [students, setStudents] = useState([]);
    const [batches, setBatches] = useState([]);
    const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]); // YYYY-MM-DD format
    const [[user, setUser], [token, setToken], [isAuthenticated, setIsAuthenticated], [userType, setUserType]] = useContext(userCont);

    useEffect(() => {
        fetch(`http://127.0.0.1:8000/staff/courses/${courseId}/batches`)
            .then(response => response.json())
            .then(data => setBatches(data))
            .catch(error => console.error('Error fetching batches', error));
    }, [courseId]);

    useEffect(() => {
        if (batch_id) {
            fetchAttendanceData(batch_id);
        }
    }, [batch_id, attendanceDate]);

    const fetchAttendanceData = async (batchId) => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/staff/attendance/${batchId}/`, {
                params: {
                    month: new Date(attendanceDate).getMonth() + 1,
                    year: new Date(attendanceDate).getFullYear()
                },
                headers: {
                    Authorization: `Token ${token}`
                }
            });

            setStudents(response.data); // Update students state with fetched data
        } catch (error) {
            console.error('Error fetching attendance data', error);
        }
    };

    const handleAttendanceChange = (studentId, status) => {
        setStudents(prevStudents =>
            prevStudents.map(student => {
                if (student.student.id === studentId) {
                    const updatedAttendance = student.attendances.map(att =>
                        att.date === attendanceDate ? { ...att, status: status } : att
                    );
                    return {
                        ...student,
                        attendances: updatedAttendance
                    };
                }
                return student;
            })
        );
    };

    const saveAttendance = async () => {
        try {
            const attendanceData = students.map(student => ({
                student_id: student.student.id,
                date: attendanceDate,
                status: student.attendances.find(att => att.date === attendanceDate)?.status || 'ABSENT',
            }));

            await axios.post(`http://127.0.0.1:8000/staff/attendance/${batch_id}/`, {
                attendance: attendanceData
            }, {
                headers: {
                    Authorization: `Token ${token}`
                }
            });
            alert('Attendance updated successfully');
        } catch (error) {
            console.error('Error saving attendance data', error);
        }
    };

    const addAttendance = async (studentId) => {
        try {
            await axios.post(`http://127.0.0.1:8000/staff/attendance/${batch_id}/add/`, {
                student_id: studentId,
                date: attendanceDate,
                status: students.find(s => s.student.id === studentId).attendances.find(att => att.date === attendanceDate)?.status || 'PRESENT',
            }, {
                headers: {
                    Authorization: `Token ${token}`
                }
            });
            alert('Attendance added successfully');
            fetchAttendanceData(batch_id); // Refresh attendance data after adding
        } catch (error) {
            console.error('Error adding attendance data', error);
        }
    };

    return (
        <div className='stdattendance_staffdiv'>
            <h1>Student Attendance</h1>
            <div className='select_date_div'>
            <div><BackButton /></div>
                <select onChange={(e) => fetchAttendanceData(e.target.value)}>
                    <option value="">Select Batch</option>
                    {batches.map(b => (
                        <option key={b.id} value={b.id}>{b.Batch_name}</option>
                    ))}
                </select>
                <input
                    type="date"
                    value={attendanceDate}
                    onChange={(e) => setAttendanceDate(e.target.value)}
                />
                <button onClick={saveAttendance}>Save Attendance</button>
            </div>
            <div className='attendance-container'>
                {students.length > 0 ? (
                    <table className='attendance-table'>
                        <thead>
                            <tr>
                                <th>Student ID</th>
                                <th>Name</th>
                                <th>Contact Number</th>
                                <th>Email</th>
                                <th>Attendance</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map(studentData => (
                                <tr key={studentData.student.id}>
                                    <td>{studentData.student.id}</td>
                                    <td>{studentData.student.studentFullName}</td>
                                    <td>{studentData.student.contact_num}</td>
                                    <td>{studentData.student.email}</td>
                                    <td>
                                        {studentData.attendances.find(att => att.date === attendanceDate) ? (
                                            <select
                                                value={studentData.attendances.find(att => att.date === attendanceDate).status}
                                                onChange={(e) => handleAttendanceChange(studentData.student.id, e.target.value)}
                                            >
                                                <option value="PRESENT">Present</option>
                                                <option value="ABSENT">Absent</option>
                                            </select>
                                        ) : (
                                            <>
                                                <select
                                                    value={''}
                                                    onChange={(e) => handleAttendanceChange(studentData.student.id, e.target.value)}
                                                >
                                                    <option value="">Select Status</option>
                                                    <option value="PRESENT">Present</option>
                                                    <option value="ABSENT">Absent</option>
                                                </select>
                                                <button onClick={() => addAttendance(studentData.student.id)}>Save Attendance</button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No attendance data available for selected batch.</p>
                )}
            </div>
        </div>
    );
};

export default AddStudentAttendanceByStaff;



/*
import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { userCont } from './App';
import './KnowStudentAttendanceByStaff.css';

const AddStudentAttendanceByStaff = () => {
    const { batch_id, courseId } = useParams();
    const [students, setStudents] = useState([]);
    const [batches, setBatches] = useState([]);
    const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]); // YYYY-MM-DD format
    const [[user, setUser], [token, setToken], [isAuthenticated, setIsAuthenticated], [userType, setUserType]] = useContext(userCont);

    useEffect(() => {
        fetch(`http://127.0.0.1:8000/staff/courses/${courseId}/batches`)
            .then(response => response.json())
            .then(data => setBatches(data))
            .catch(error => console.error('Error fetching batches', error));
    }, [courseId]);

    useEffect(() => {
        if (batch_id) {
            fetchAttendanceData(batch_id);
        }
    }, [batch_id]); // Only depend on batch_id for fetching attendance data

    const fetchAttendanceData = async (batchId) => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/staff/attendance/${batchId}/`, {
                headers: {
                    Authorization: `Token ${token}`
                }
            });

            setStudents(response.data); // Update students state with fetched data

            console.log('Updated students state:', response.data);
        } catch (error) {
            console.error('Error fetching attendance data', error);
        }
    };

    const renderAttendanceForm = (studentData) => {
        const attendanceForDate = studentData.attendances.find(att => att.date === attendanceDate);

        if (attendanceForDate) {
            return (
                <div>
                    <p>Attendance Status for {attendanceDate}: {attendanceForDate.status}</p>
                    <select
                        value={attendanceForDate.status}
                        onChange={(e) => handleAttendanceChange(studentData.student.id, e.target.value)}
                    >
                        <option value="PRESENT">Present</option>
                        <option value="ABSENT">Absent</option>
                    </select>
                </div>
            );
        } else {
            return (
                <div>
                    <p>No attendance recorded for {attendanceDate}.</p>
                    <select
                        value={''}
                        onChange={(e) => handleAttendanceChange(studentData.student.id, e.target.value)}
                    >
                        <option value="">Select Status</option>
                        <option value="PRESENT">Present</option>
                        <option value="ABSENT">Absent</option>
                    </select>
                    <button onClick={() => addAttendance(studentData.student.id)}>Save Attendance</button>
                </div>
            );
        }
    };

    const handleAttendanceChange = (studentId, status) => {
        setStudents(prevStudents =>
            prevStudents.map(student => {
                if (student.student.id === studentId) {
                    const updatedAttendance = student.attendances.map(att =>
                        att.date === attendanceDate ? { ...att, status: status } : att
                    );
                    return {
                        ...student,
                        attendances: updatedAttendance
                    };
                }
                return student;
            })
        );
    };
    const saveAttendance = async () => {
        try {
            const attendanceData = students.map(student => ({
                student_id: student.student.id,
                date: attendanceDate,
                status: student.attendance.find(att => att.date === attendanceDate).status,
            }));

            await axios.post(`http://127.0.0.1:8000/staff/attendance/${batch_id}/`, {
                attendance: attendanceData
            }, {
                headers: {
                    Authorization: `Token ${token}`
                }
            });
            alert('Attendance updated successfully');
        } catch (error) {
            console.error('Error saving attendance data', error);
        }
    };

    const addAttendance = async (studentId) => {
        try {
            const response = await axios.post(`http://127.0.0.1:8000/staff/attendance/${batch_id}/add/`, {
                student_id: studentId,
                date: attendanceDate,
                status: students.find(s => s.student.id === studentId).attendances.find(att => att.date === attendanceDate)?.status || 'PRESENT',
            }, {
                headers: {
                    Authorization: `Token ${token}`
                }
            });
            alert('Attendance added successfully');
            fetchAttendanceData(batch_id); // Refresh attendance data after adding
        } catch (error) {
            console.error('Error adding attendance data', error);
        }
    };

    return (
        <div>
            <div className='select_date_div'>
                <h1>Student Attendance</h1>
                <select onChange={(e) => fetchAttendanceData(e.target.value)}>
                    <option value="">Select Batch</option>
                    {batches.map(b => (
                        <option key={b.id} value={b.id}>{b.Batch_name}</option>
                    ))}
                </select>
                <input
                    type="date"
                    value={attendanceDate}
                    onChange={(e) => setAttendanceDate(e.target.value)}
                />
                <button onClick={saveAttendance}>Save Attendance</button>
            </div>
            <div className='attendance-container'>
                {students.length > 0 ? (
                    students.map(studentData => (
                        <div key={studentData.student.id} className='attendance-item student-attendance'>
                            <h2>{studentData.student.studentFullName}</h2>
                            {renderAttendanceForm(studentData)}
                        </div>
                    ))
                ) : (
                    <p>No attendance data available for selected batch.</p>
                )}
            </div>
        </div>
    );
};

export default AddStudentAttendanceByStaff;

*/
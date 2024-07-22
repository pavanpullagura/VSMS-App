import React, { useState, useEffect,useContext } from 'react';
import axios from 'axios';
import { userCont } from '../../App';
import BackButton from '../BackButtonFunctionality';
import './AllStudentsDetailsForExecutives.css';

const AllStudentsDetailsTable = () => {
    let [[user,setUser],[token, setToken],[isAuthenticated, setIsAuthenticated],[userType, setUserType]] = useContext(userCont);
    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [showFeePopup, setShowFeePopup] = useState(false);
    const [showAddFeePopup, setShowAddFeePopup] = useState(false);
    const [newFeeDetails, setNewFeeDetails] = useState({
        total_fee: '',
        paid_amount: '',
        pending_amount: '',
        payment_date: ''
    });
    useEffect(() => {
        axios.get('http://127.0.0.1:8000/staff/allstudents/', {
            headers: {
                'Authorization': 'Token ' + token
            }
        }).then(response => {
            const studentData = response.data['stdData'];
            const promises = studentData.map(student => {
                return Promise.all([
                    axios.get(`http://127.0.0.1:8000/staff/allstudents/${student.id}/average_attendance/`),
                    axios.get(`http://127.0.0.1:8000/staff/allstudents/${student.id}/average_mock_performance/`),
                    axios.get(`http://127.0.0.1:8000/staff/allstudents/${student.id}/average_weekly_tests/`)
                ]).then(responses => {
                    return {
                        ...student,
                        averageAttendance: responses[0].data.average_attendance,
                        averageMockPerformance: responses[1].data.average_mock_performance,
                        averageWeeklyTests: responses[2].data.average_weekly_tests
                    };
                });
            });
            Promise.all(promises).then(data => {
                setStudents(data);
            });
        });
    }, [token]);
/*
    useEffect(() => {
        axios.get('http://127.0.0.1:8000/staff/allstudents/', {
            headers: {
                'Authorization': 'Token ' + token
            }
        }).then(response => {
            setStudents(response.data['stdData']);
        });
    }, [token]);
*/

    const handleFeeDetails = (student) => {
        axios.get(`http://127.0.0.1:8000/staff/allstudents/${student.id}/fee_details/`).then(response => {
            setSelectedStudent({ ...student, feeDetails: response.data });
            console.log('seleceted',selectedStudent,response.data);
            setShowFeePopup(true);
        });
    };

    /*
    const handleAverageAttendance = (studentId) => {
        axios.get(`http://127.0.0.1:8000/staff/allstudents/${studentId}/average_attendance/`).then(response => {
            setSelectedStudent(prevState => ({ ...prevState, averageAttendance: response.data.average_attendance }));
        });
    };

    const handleAverageMockPerformance = (studentId) => {
        axios.get(`http://127.0.0.1:8000/staff/allstudents/${studentId}/average_mock_performance/`).then(response => {
            setSelectedStudent(prevState => ({ ...prevState, averageMockPerformance: response.data.average_mock_performance }));
        });
    };

    const handleAverageWeeklyTests = (studentId) => {
        axios.get(`http://127.0.0.1:8000/staff/allstudents/${studentId}/average_weekly_tests/`).then(response => {
            setSelectedStudent(prevState => ({ ...prevState, averageWeeklyTests: response.data.average_weekly_tests }));
        });
    };

*/
    const handleAddFeeDetail = () => {
        console.log('Addd new fee details',newFeeDetails);
        axios.post(`http://127.0.0.1:8000/staff/allstudents/${selectedStudent.id}/add_fee_detail/`, newFeeDetails).then(response => {
            setShowAddFeePopup(false);
            setNewFeeDetails({
                total_fee: '',
                paid_amount: '',
                pending_amount: '',
                payment_date: ''
            });
        });
    };

    const handleModifyFeeStatus = (status) => {
        axios.patch(`http://127.0.0.1:8000/staff/allstudents/${selectedStudent.id}/modify_fee_status/`, { certification_completed: status }).then(response => {
            setShowFeePopup(false);
        });
    };

    return (
        <div>
            <div><BackButton /></div>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Contact Number</th>
                        <th>Email</th>
                        <th>Fee Details</th>
                        <th>Attendance</th>
                        <th>Mock Performance</th>
                        <th>Weekly Test Reports</th>
                        <th>Certification</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map(student => (
                        <tr key={student.id}>
                            <td>{student.studentFullName}</td>
                            <td>{student.contact_num}</td>
                            <td>{student.email}</td>
                            <td>
                                <button onClick={() => handleFeeDetails(student)}>View</button>
                            </td>
                            <td>{student.averageAttendance.toFixed(2)}%</td>
                            <td>{student.averageMockPerformance.toFixed(2)}%</td>
                            <td>{student.averageWeeklyTests.toFixed(2)}%</td>
                            <td>
                                {student.certification_completed ? (
                                    <span style={{ color: 'green' }}>✔️</span>
                                ) : (
                                    <span style={{ color: 'red' }}>❌</span>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
                {/*
                <tbody>
                    {students.map(student => (
                        <tr key={student.id}>
                            <td>{student.studentFullName}</td>
                            <td>{student.contact_num}</td>
                            <td>{student.email}</td>
                            <td>
                                <button onClick={() => handleFeeDetails(student)}>View</button>
                            </td>
                            <td>
                                <button onClick={() => handleAverageAttendance(student.id)}>View</button>
                                {selectedStudent && selectedStudent.id === student.id && selectedStudent.averageAttendance !== undefined && (
                                    <span>{selectedStudent.averageAttendance}%</span>
                                )}
                            </td>
                            <td>
                                <button onClick={() => handleAverageMockPerformance(student.id)}>View</button>
                                {selectedStudent && selectedStudent.id === student.id && selectedStudent.averageMockPerformance !== undefined && (
                                    <span>{selectedStudent.averageMockPerformance}</span>
                                )}
                            </td>
                            <td>
                                <button onClick={() => handleAverageWeeklyTests(student.id)}>View</button>
                                {selectedStudent && selectedStudent.id === student.id && selectedStudent.averageWeeklyTests !== undefined && (
                                    <span>{selectedStudent.averageWeeklyTests}</span>
                                )}
                            </td>
                            <td>
                                {student.certification_completed ? (
                                    <span style={{ color: 'green' }}>✔️</span>
                                ) : (
                                    <span style={{ color: 'red' }}>❌</span>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>*/}
            </table>

            {showFeePopup && selectedStudent && (
                <div className="popup">
                    <h2>Fee Details for {selectedStudent.studentFullName}</h2>
                    <ul className='fee_popup_details'>
                        {selectedStudent.feeDetails.map(fee => (
                            <li key={fee.id}>
                                <p>Total Fee: <span>{fee.total_fee},</span></p>
                                <p>Paid Amount: <span>{fee.paid_amount},</span>  </p>
                                <p>Pending Amount: <span>{fee.pending_amount},</span>  </p>
                                <p> Payment Date: <span>{fee.payment_date}</span>  </p>
                            </li>
                        ))}
                    </ul>
                    <div className='fee_btns_div'>
                    <button onClick={() => setShowAddFeePopup(true)} className='fee_btns btn_style'>Add Fee Detail</button>
                    <button onClick={() => handleModifyFeeStatus(true)} className='fee_certificate_btns btn_style'>Set Certification Completed</button>
                    <button onClick={() => handleModifyFeeStatus(false)} className='fee_certificate_btns btn_style'>Set Certification Not Completed</button>
                    <button onClick={() => setShowFeePopup(false)} className='fee_close_btns'>Close</button>
                    </div>
                </div>
            )}

            {showAddFeePopup && (
                <div className="popup">
                    <h2>Add Fee Detail</h2>
                    <input
                        type="text"
                        placeholder={`Enter Total Fee as: ${selectedStudent.feeDetails[0].total_fee}`}
                        value={newFeeDetails.total_fee }
                        onChange={(e) => setNewFeeDetails({ ...newFeeDetails, total_fee: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Paid Amount"
                        value={newFeeDetails.paid_amount}
                        onChange={(e) => setNewFeeDetails({ ...newFeeDetails, paid_amount: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Pending Amount"
                        value={newFeeDetails.pending_amount}
                        onChange={(e) => setNewFeeDetails({ ...newFeeDetails, pending_amount: e.target.value })}
                    />
                    <input
                        type="date"
                        value={newFeeDetails.payment_date}
                        onChange={(e) => setNewFeeDetails({ ...newFeeDetails, payment_date: e.target.value })}
                    />
                    <button onClick={handleAddFeeDetail} className='fee_btns'>Add</button>
                    <button onClick={() => setShowAddFeePopup(false)} className='fee_close_btns'>Cancel</button>
                </div>
            )}
        </div>
    );
};

export default AllStudentsDetailsTable;

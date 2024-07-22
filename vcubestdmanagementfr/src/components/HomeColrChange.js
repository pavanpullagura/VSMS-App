// src/components/Home.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Home = ({ userType, user }) => {
    const [attendance, setAttendance] = useState(null);

    useEffect(() => {
        if (userType === 'student') {
            axios.get(`http://127.0.0.1:8000/attendance/${user.id}/`)
                .then(response => {
                    const totalDays = response.data.attendance.length;
                    const presentDays = response.data.attendance.filter(a => a.status === 'PRESENT').length;
                    const attendancePercentage = (presentDays / totalDays) * 100;
                    setAttendance(attendancePercentage);
                })
                .catch(error => console.error('Error fetching attendance data:', error));
        }
    }, [userType, user.id]);

    return (
        <div>
            <h1>Welcome {user.username}</h1>
            {userType === 'student' && attendance !== null && (
                <div>
                    <h2>Your Overall Attendance: {attendance.toFixed(2)}%</h2>
                    <div style={{ background: attendance > 70 ? 'green' : attendance > 45 ? 'orange' : 'red' }}>
                        {attendance.toFixed(2)}%
                    </div>
                </div>
            )}
            {userType === 'staff' && (
                <div>
                    <h2>Your Details</h2>
                    {/* Staff specific content */}
                </div>
            )}
        </div>
    );
};

export default Home;

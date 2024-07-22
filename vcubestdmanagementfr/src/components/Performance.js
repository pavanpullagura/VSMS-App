// Performance.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';

const Performance = ({ user }) => {
    const [performance, setPerformance] = useState([]);

    useEffect(() => {
        axios.get(`/api/students/${user.id}/performance/`)
            .then(response => setPerformance(response.data))
            .catch(error => console.error('There was an error fetching performance!', error));
    }, [user.id]);

    const performanceData = {
        labels: performance.map(p => p.test_date),
        datasets: [
            {
                label: 'Performance',
                data: performance.map(p => (p.obtained_marks / p.total_marks) * 100),
                backgroundColor: performance.map(p => {
                    const percentage = (p.obtained_marks / p.total_marks) * 100;
                    return percentage > 70 ? 'green' : percentage > 45 ? 'orange' : 'red';
                }),
            }
        ]
    };

    return (
        <div className="performance-page">
            <h2>Your Performance</h2>
            <Pie data={performanceData} />
        </div>
    );
};

export default Performance;

/*
// src/components/Performance.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './Performance.css';

const Performance = () => {
    const { student_id } = useParams();
    const [testResults, setTestResults] = useState([]);
    const [overallPerformance, setOverallPerformance] = useState(null);

    useEffect(() => {
        fetchTestResults(student_id);
    }, [student_id]);

    const fetchTestResults = async (studentId) => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/performance/${studentId}/`, {
                headers: {
                    Authorization: `Token ${localStorage.getItem('token')}`
                }
            });
            setTestResults(response.data);
            calculateOverallPerformance(response.data);
        } catch (error) {
            console.error('Error fetching test results:', error);
        }
    };

    const calculateOverallPerformance = (data) => {
        const totalMarks = data.reduce((acc, result) => acc + result.total_marks, 0);
        const obtainedMarks = data.reduce((acc, result) => acc + result.obtained_marks, 0);
        const performancePercentage = (obtainedMarks / totalMarks) * 100;
        setOverallPerformance(performancePercentage);
    };

    return (
        <div>
            <h1>Performance</h1>
            <table>
                <thead>
                    <tr>
                        <th>Test Date</th>
                        <th>Obtained Marks</th>
                        <th>Total Marks</th>
                    </tr>
                </thead>
                <tbody>
                    {testResults.map(result => (
                        <tr key={result.test_date}>
                            <td>{result.test_date}</td>
                            <td>{result.obtained_marks}</td>
                            <td>{result.total_marks}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {overallPerformance !== null && (
                <div>
                    <h2>Overall Performance: {overallPerformance.toFixed(2)}%</h2>
                    <div style={{ background: overallPerformance > 70 ? 'green' : overallPerformance > 45 ? 'orange' : 'red' }}>
                        {overallPerformance.toFixed(2)}%
                    </div>
                </div>
            )}
        </div>
    );
};

export default Performance;
*/

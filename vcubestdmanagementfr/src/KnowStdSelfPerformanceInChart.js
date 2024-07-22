import React, { useEffect, useState,useContext } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import { Bar } from 'react-chartjs-2';
import './KnowStdSelfPerformanceInChart.css';
import { userCont } from './App';
import BackButton from './components/BackButtonFunctionality';

const StudentSelfPerformanceInChart = () => {
  const [weeklyTestData, setWeeklyTestData] = useState([]);
  const [mockInterviewData, setMockInterviewData] = useState([]);
  let [[user, setUser], [token, setToken], [isAuthenticated, setIsAuthenticated],[userType, setUserType]]= useContext(userCont);
  //const { studentId } = useParams();

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/student/performance/',{
        headers:{
            'Authorization':'Token '+token
        }
    })
      .then(response => {
        setWeeklyTestData(response.data['weekly_tests']);
        console.log('Weekly data',response.data['weekly_tests']);
        console.log('weeklysetdata',weeklyTestData)
        setMockInterviewData(response.data['mock_interviews']);
        console.log('mockdata',mockInterviewData);
        //weeklyTestData.map((w)=>console.log(w.t));
      })
      .catch(error => console.error(error));

    
  }, []);
 
  const weeklyTestChartData = {
    labels: weeklyTestData.map(test => test.test_date),
    datasets: [
      {
        label: 'Weekly Test Performance',
        data: weeklyTestData.map(test => test.obtained_marks),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
      },
    ],
  };

  const mockInterviewChartData = {
    labels: mockInterviewData.map(interview => interview.interview_date),
    datasets: [
      {
        label: 'Mock Interview Performance',
        data: mockInterviewData.map(interview => interview.obtained_score),
        backgroundColor: 'rgba(255, 255, 255)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <>
    <div><BackButton /></div>
    <div className='stdself_performance_charts'>
      <h2>Weekly Test Performance</h2>
      <Line data={weeklyTestChartData} />
      <p><Link to='/stdselfperformance'>Detailed Performance</Link></p>

      <h2>Mock Interview Performance</h2>
      <Bar data={mockInterviewChartData} />
    </div>
    </>
  );
};

export default StudentSelfPerformanceInChart;

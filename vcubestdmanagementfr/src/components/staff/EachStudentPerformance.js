import React, { useState, useEffect,useContext } from 'react';
import axios from 'axios';
import Chart from 'chart.js/auto'; // Ensure you are importing the correct Chart.js module
import { userCont } from '../../App';
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';
import '../StudentSelfPerformance.css';
//import zIndex from '@mui/material/styles/zIndex';
import BackButton from '../BackButtonFunctionality';

const EachStudentPerformance = ( stdId ) => {
  const [weeklyTests, setWeeklyTests] = useState([]);
  const [mockInterviews, setMockInterviews] = useState([]);
  let [[user, setUser], [token, setToken], [isAuthenticated, setIsAuthenticated],[userType, setUserType]]= useContext(userCont);

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/staff/eachstdperformance/${stdId}`, {
      headers: {
        'Authorization': 'Token ' + token
      }
    })
    .then(response => {
      setWeeklyTests(response.data.weekly_tests);
      console.log(weeklyTests);
      setMockInterviews(response.data.mock_interviews);

      // After setting data, render charts
      renderCharts(response.data.weekly_tests, response.data.mock_interviews);
    })
    .catch(error => {
      console.error('Error fetching performance data:', error);
    });
  }, []);

  const renderCharts = (weeklyTestsData, mockInterviewsData) => {
    renderWeeklyTestsChart(weeklyTestsData);
    //renderMockInterviewsChart(mockInterviewsData);
  };

  const renderWeeklyTestsChart = (data) => {
    const weeklyTestsCanvas = document.getElementById('weeklyTestsChart');
    
  if (weeklyTestsCanvas) {
    // Check if there's already a chart instance associated with this canvas
    if (weeklyTestsCanvas.chart) {
      weeklyTestsCanvas.chart.destroy(); // Destroy the existing chart instance
    }

    // Render the new chart
    weeklyTestsCanvas.chart = new Chart(weeklyTestsCanvas, {
      type: 'bar',
      data: {
        labels: data.map(test => test.test_date),
        datasets: [{
          label: 'Obtained Marks',
          data: data.map(test => test.obtained_marks),
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      },
      options: {
        // Chart.js options
      }
    });
  }
    if (weeklyTestsCanvas) {
      new Chart(weeklyTestsCanvas, {
        type: 'bar',
        data: {
          labels: data.map(test => test.test_date),
          datasets: [{
            label: 'Obtained Marks',
            data: data.map(test => test.obtained_marks),
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
          }]
        },
        options: {
          // Chart.js options
        }
      });
    }
  };
  const renderMockInterviewsChart = (data) => {
    const mockInterviewsCanvas = document.getElementById('mockInterviewsChart');

    if (mockInterviewsCanvas) {
      new Chart(mockInterviewsCanvas, {
        type: 'line',
        data: {
          labels: data.map(interview => interview.interview_date),
          datasets: [{
            label: 'Obtained Score',
            data: data.map(interview => interview.obtained_score),
            backgroundColor: 'rgba(255, 255,255)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1
          }]
        },
        options: {
          // Chart.js options
        }
      });
    }
  };
  const renderWeeklyTests = (data) => {
    return data.map((item, index) => (
      <tr key={index}>
        <td>{item.student}</td>
        <td>{item.test_date}</td>
        <td>{item.obtained_marks}</td>
        <td>{item.total_marks}</td>
      </tr>
    ));
  };
  const renderMockInterviews = (data) => {
    return data.map((item, index) => (
      <tr key={index}>
        <td>{item.student}</td>
        <td>{item.interview_date}</td>
        <td>{item.obtained_score}</td>
        <td>{item.total_score}</td>
      </tr>
    ));
  };
  return (
    <>
    <div><BackButton /></div>
    <div className='performancechartdiv'>
      <h2>Weekly Test Performance</h2>
      <table>
        <thead>
        <tr><th>Student ID</th><th>Test Date</th><th>Obtained Marks</th><th>Total Marks</th></tr>
        </thead>
        <tbody>
            {renderWeeklyTests(weeklyTests)}
          </tbody>
      </table>
      {/*<canvas id="weeklyTestsChart" width="400" height="200"></canvas>*/}

      <h2>Mock Interview Performance</h2>
      {/*<canvas id="mockInterviewsChart" width="400" height="200"></canvas>*/}
      <table>
        <thead>
        <tr><th>Student ID</th><th>Interview Date</th><th>Obtained Score</th><th>Total Score</th></tr>
        </thead>
        <tbody>
            {renderMockInterviews(mockInterviews)}
          </tbody>
      </table>
    </div>
    </>
  );
};

export default EachStudentPerformance;

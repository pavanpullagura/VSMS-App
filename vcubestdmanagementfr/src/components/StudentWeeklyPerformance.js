// WeeklyTestsStudent.js
import React, {useContext,useState,useEffect} from 'react';
import { useParams } from 'react-router-dom';
import { userCont } from '../App';
import axios from 'axios';
import BackButton from './BackButtonFunctionality';

const StudentWeeklyTests = () => {
    let { stduname } = useParams();
    const [weeklyTests, setWeeklyTests] = useState([]);
    let [[user, setUser], [token, setToken], [isAuthenticated, setIsAuthenticated],[userType, setUserType]]= useContext(userCont);

    useEffect(() => {
      const fetchWeeklyTests = async () => {
        try {
          const response = await axios.get(`http://127.0.0.1:8000/staff/student_weekly_tests/${stduname}`,{
            headers:{
              'Authorization':'Token '+token
            }
          });
          setWeeklyTests(response.data);
          console.log(response.data);
        } catch (error) {
          console.error(error);
        }
      };

      fetchWeeklyTests();
    }, []);
    return (
      <>
      <div><BackButton /></div>
      <div>
        <h2>Weekly Tests for {stduname}</h2>
        <table>
      <thead>
        <tr>
          <th>Test Date</th>
          <th>Obtained Marks</th>
          <th>Total Marks</th>
        </tr>
      </thead>
      <tbody>
        {weeklyTests.map((test) => (
          <tr key={test.id}>
            <td>{test.test_date}</td>
            <td>{test.obtained_marks}</td>
            <td>{test.total_marks}</td>
          </tr>
        ))}
      </tbody>
    </table>
      </div>
      </>
    );
};

export default StudentWeeklyTests;
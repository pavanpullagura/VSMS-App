import React, {useContext,useState,useEffect} from 'react';
import { useParams } from 'react-router-dom';
import { userCont } from '../App';
import axios from 'axios';
import BackButton from './BackButtonFunctionality';

const StudentMockInterviews = () => {
  let { stduname } = useParams();
  const [mockInterviews, setMockInterviews] = useState([]);
  let [[user, setUser], [token, setToken], [isAuthenticated, setIsAuthenticated],[userType, setUserType]]= useContext(userCont);

  useEffect(() => {
    const fetchMockInterviews = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/staff/student_mock_interviews/${stduname}`,{
          headers:{
            'Authorization':'Token '+token
          }
        });
        setMockInterviews(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchMockInterviews();
  }, []);
  return (
    <>
    <div><BackButton /></div>
    <div>
      <h2>Mock Interviews for {stduname}</h2>
      <table>
      <thead>
        <tr>
          <th>Interview Date</th>
          <th>Obtained Score</th>
          <th>Total Score</th>
        </tr>
      </thead>
      <tbody>
        {mockInterviews.map((m) => (
          <tr key={m.id}>
            <td>{m.interview_date}</td>
            <td>{m.obtained_score}</td>
            <td>{m.total_score}</td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>
    </>
  );
};

export default StudentMockInterviews;
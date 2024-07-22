// Dashboard.js
import { userCont } from './App';
import React, { useState, useEffect,useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const { course } = useParams();
  const [batches, setBatches] = useState([]);
  let [[user, setUser], [token, setToken], [isAuthenticated, setIsAuthenticated],[userType, setUserType]]= useContext(userCont);

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/staff/allbatches/', {
          headers: { Authorization: 'Token '+token }
        });
        setBatches(response.data);
      } catch (error) {
        console.error('Error fetching batches', error);
      }
    };

    fetchBatches();
  }, [course]);

  return (
    <div>
      <h2>{course} Batches</h2>
      <ul>
        {batches.map(batch => (
          <li key={batch.id}>
            <Link to={`/allbatches/${course}/${batch.id}`}>{batch.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;

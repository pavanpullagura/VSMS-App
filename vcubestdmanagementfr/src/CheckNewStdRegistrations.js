
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { userCont } from './App';
import './CheckNewStdRegistrations.css';
import BackButton from './components/BackButtonFunctionality';
import noDataImage from './images/2953962.jpg';

const CheckNewRegistrations = () => {
    const [students, setStudents] = useState([]);
    let [[user, setUser], [token, setToken], [isAuthenticated, setIsAuthenticated],[userType, setUserType]] = useContext(userCont);

    useEffect(() => {
        const fetchUnconfirmedStudents = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/staff/unconfirmed-students/', {
                    headers: {
                        Authorization: `Token ${token}`
                    }
                });
                setStudents(response.data);
            } catch (error) {
                console.error('Error fetching unconfirmed students', error);
            }
        };

        fetchUnconfirmedStudents();
    }, [token]);

    const handleConfirm = async (studentId) => {
        try {
            await axios.post(`http://127.0.0.1:8000/staff/confirm-registration/${studentId}/`, {}, {
                headers: {
                    Authorization: `Token ${token}`
                }
            });
            setStudents(students.filter(student => student.id !== studentId));
        } catch (error) {
            console.error('Error confirming registration', error);
        }
    };

    const handleDecline = async (studentId) => {
        try {
            await axios.post(`http://127.0.0.1:8000/staff/decline-registration/${studentId}/`, {}, {
                headers: {
                    Authorization: `Token ${token}`
                }
            });
            setStudents(students.filter(student => student.id !== studentId));
        } catch (error) {
            console.error('Error declining registration', error);
        }
    };
    console.log(students);
    return (
        <>
        <div className='unregistered_stds_div'>
        <div><BackButton /></div>
            <h1>Check New Registrations</h1>
            {students.length>0 ? (students.map(student => (
                <div key={student.id} className='stddetails_to_check'>
                    <h2>{student.id}</h2>
                    <h2>{student.studentFullName}</h2>
                    <p>{student.email}</p>
                    <p>{student.course_details}</p>
                    <p>{student.batch_details}</p>
                    <button onClick={() => handleConfirm(student.id)}>Accept</button>
                    <button onClick={() => handleDecline(student.id)}>Decline</button>
                </div>
            ))) : <><div className='nodatadiv'><img src={noDataImage} alt='NO DATA' width='300px' height='350px' /></div><p>NO NEW REGESTRATION REQUESTS. </p></>}
        </div>
        </>
    );
};

export default CheckNewRegistrations;

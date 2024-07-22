import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { userCont,courseContext } from './App';
import './StaffDashboard.css';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import { FaUserPlus, FaRegListAlt, FaClipboardList, FaChalkboardTeacher, FaUserEdit, FaSchool } from 'react-icons/fa';

const ContactedPersonsDetails = () => {
    const [contacts, setContacts] = useState([]);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [[user, setUser], [token, setToken], [isAuthenticated, setIsAuthenticated],[userType, setUserType]] = useContext(userCont);
    const [err, setErr] = useState(null);
    let [courses,setCourses] = useContext(courseContext);
    let navigate = useNavigate();

    useEffect(() => {
        const fetchContacts = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/staff/contacted-persons-details/', {
                    headers: {
                        'Authorization': 'Token ' + token
                    }
                });
                setContacts(response.data);
            } catch (error) {
                setErr('You do not have permission to view this data.');
            }
        };

        fetchContacts();
    }, [token]);

    
      const handleDeleteMessage = async ( email ) => {
          try {
              const response = await axios.delete(`http://127.0.0.1:8000/staff/delete_message/${email}`, {
                  headers: {
                      'Authorization': 'Token ' + token
                  }
              });
              if (response.status===200){
                alert('Message Details Deleted');
              }
          } catch (error) {
              setError('You do not have permission to view this data.',error);
          }
      };

  
    

    const handleViewMessage = (message) => {
        setSelectedMessage(message);
    };

    const handleCloseMessage = () => {
        setSelectedMessage(null);
    };
    let displayCourses = async()=>{
        console.log(token,isAuthenticated);
        try{
          let response = await axios.get('http://127.0.0.1:8000/staff/allcourses/',
            {},
            {
              headers: {
                "Authorization":'Token '+token,
              },
            }
          );
          if (response.status === 200) {
            setCourses(response.data);
            console.log(courses);
            navigate('/dashboard/courses')
          } else {
            console.error('Logout failed with status:', response.status);
          }
        }catch (error) {
          console.error('There was an error fetching data!', error);
        }
      }
       console.log(user);

       const [userProfile, setUserProfile] = useState(null);
       const [loading, setLoading] = useState(true);
       const [error, setError] = useState(null);
     
       useEffect(() => {
           const fetchUserProfile = async () => {
               if (token) {
                   try {
                       const response = await axios.get(`http://127.0.0.1:8000/${userType}/profile/${user}/`, {
                           headers: {
                               'Authorization': 'Token ' + token
                           }
                       });
                       if(userType=='staff'){
                         setUserProfile(response.data.profileObj[0]);
                         //setObjid(parseInt(response.data.profileObj[0]['id']))
                       }else{
                         setUserProfile(response.data.profileObj[0]);
                         //setObjid(parseInt(response.data.profileObj[0]['id']))
                       }
                         // Assuming profileObj is an array
                       setLoading(false);
                       console.log('USER PROEJROJSEFJ',userProfile,response.data.profileObj);
                       //setObjid(parseInt(response.data.profileObj[0]['id']))
                       console.log(response.data.profileObj[0]['id']);
                       //console.log(objid);
                   } catch (err) {
                       setError(err);
                       setLoading(false);
                   }
               }
           };
     
           fetchUserProfile();
       }, [token, user, userType]);
      
     
    return (
        <>
        {(contacts.length!==0?
        <div className="contacted-persons-details">
            <h2>Contacted Persons Details</h2>
            {err && <p>{err}</p>}
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Contact Number</th>
                        <th>Message</th>
                    </tr>
                </thead>
                <tbody>
                    {contacts.map((contact) => (
                        <tr key={contact.id}>
                            <td>{contact.name}</td>
                            <td>{contact.email}</td>
                            <td>{contact.contact_num}</td>
                            <td><button onClick={() => handleViewMessage(contact.message)}>View Message</button>&nbsp;/&nbsp;
                                <button onClick={() => handleDeleteMessage(contact.email)}>Delete Message</button>
                            </td>
                            
                        </tr>
                    ))}
                </tbody>
            </table>
            {selectedMessage && (
                <div className="message-popup">
                    <div className="message-popup-content">
                        <button className="close-button" onClick={handleCloseMessage}>Close</button>
                        <p>{selectedMessage}</p>
                    </div>
                </div>
            )}
        </div>:'')}
        <div className='main'>
        <div className='dashboard-container'>
        <header className='dashboard-header'>
            <h1>Welcome, {userProfile ? userProfile.first_name + ' '+userProfile.last_name : 'Staff'}</h1>
        </header>
        
        <div className='dashboard-main'>
            <div className='dashboard-actions'>
            <Link to="/enrolledstdlist" className='dashboard-button'>
                <FaClipboardList className='dashboard-icon' />
                New Enrolled students List
            </Link>   
            {user && (
                <button className='dashboard-button' onClick={displayCourses}>
                <FaSchool className='dashboard-icon' />
                Courses Wise Students Attendance Details
                </button>
            )}
            <Link to="/addnewbatch" className='dashboard-button'>
                <FaUserPlus className='dashboard-icon' />
                Add New Batch
            </Link>
            <Link to="/checknewregistrations" className='dashboard-button'>
                <FaRegListAlt className='dashboard-icon' />
                Check New Registration Requests
            </Link>
            <Link to="/allstdattendance" className='dashboard-button'>
                <FaClipboardList className='dashboard-icon' />
                View All Students Attendance
            </Link>
            <Link to="/allstddetailstableforexecutives" className='dashboard-button'>
                <FaClipboardList className='dashboard-icon' />
                View All Students Details
            </Link>
            <Link to="/addtestreport" className='dashboard-button'>
                <FaChalkboardTeacher className='dashboard-icon' />
                Submit Student Test Reports
            </Link>
            <Link to="/course_batch_manager" className='dashboard-button'>
                <FaUserEdit className='dashboard-icon' />
                Course & Batch Modifications
            </Link>
            <Link to="/allstddetails" className='dashboard-button'>
                <FaUserEdit className='dashboard-icon' />
                Each Students Performance Reports
            </Link>
            <Link to="/registerstudent" className='dashboard-button'>
                <FaUserPlus className='dashboard-icon' />
                Register New Student
            </Link>
            <Link to="/newstaffdashboard" className='dashboard-button'>
                <FaSchool className='dashboard-icon' />
                New Interface
            </Link>
            </div>
        </div>
    </div>
        
          
        </div>
        </>
    );
};

export default ContactedPersonsDetails;

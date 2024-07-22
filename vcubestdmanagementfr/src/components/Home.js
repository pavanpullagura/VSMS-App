
import './Home.css';
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { userCont } from '../App';
import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';

Chart.register(ArcElement, Tooltip, Legend);

const StudentHome = () => {
    const [attendance, setAttendance] = useState([]);
    const [overallAttendance, setOverallAttendance] = useState(0);
    const [[user, setUser], [token, setToken], [isAuthenticated, setIsAuthenticated], [userType, setUserType]] = useContext(userCont);
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (token) {
                try {
                    const response = await axios.get(`http://127.0.0.1:8000/${userType}/profile/${user}`, {
                        headers: {
                            'Authorization': `Token ${token}`
                        }
                    });
                    setUserProfile(response.data.profileObj[0]);
                    setLoading(false);
                    console.log('user profile fetched');
                } catch (err) {
                    setError(err);
                    setLoading(false);
                }
            }
        };

        fetchUserProfile();
    }, [token, user, userType]);

    useEffect(() => {
        if (userProfile) {
            const studentId = userProfile.id;
            console.log('userid ',studentId);
            axios.get(`http://127.0.0.1:8000/student/attendance/${studentId}/`, {
                headers: {
                    'Authorization': `Token ${token}`
                }
            }).then(response => {
                    setAttendance(response.data.attendance);
                    console.log(response.data.attendance);
                    const totalPresent = response.data.attendance.filter(attendance => attendance.status === ('PRESENT' || 'Present')).length;
                    const totalAbsent = response.data.attendance.filter(attendance => attendance.status === ('ABSENT' || 'Absent')).length;
                    setOverallAttendance((totalPresent / (totalPresent + totalAbsent)) * 100);
                    console.log(attendance);
                })
                .catch(error => console.error(error));
        }
    }, [userProfile]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    const data = {
        labels: ['Present', 'Absent'],
        datasets: [
            {
                data: [
                    attendance.filter(a => a.status === ('PRESENT' || 'Present')).length,
                    attendance.filter(a => a.status === ('ABSENT' || 'Absent')).length,
                ],
                backgroundColor: ['#008000', '#D2042D'],
                hoverBackgroundColor: ['#808000', '#FF0000'],
                radius: '40%'
            },
        ],
    };

    return (
        <div className='stdhomemaindiv'>
            <div className='stdhomeinfodiv'>
                <img src={userProfile.image} alt={userProfile.studentFullName} style={{ width: '200px', height: '200px', borderRadius: '20%' }} />
                <h2>Student Full Name: {userProfile.studentFullName}</h2>
                <h2>Course ID: {userProfile.course_details}</h2>
                <h2>Batch ID: {userProfile.batch_details}</h2>
            </div>
            <div className='chartdiv'>
                <h2>Overall Attendance: {overallAttendance.toFixed(2)}%</h2>
                <Doughnut data={data} />
            </div>
        </div>
    );
};

{/*
const Home = () => {
    const [[user, setUser], [token, setToken], [isAuthenticated, setIsAuthenticated], [userType, setUserType]] = useContext(userCont);
    return (
        <div className="home-page">
            <h1>Welcome, {user}</h1>
            {userType === 'Staff_User' ? (
                <div>
                    <h2>Staff Dashboard</h2>
                </div>
            ) : (
                <div>
                    <h2>Your Overall Performance</h2>
                    <StudentHome />
                </div>
            )}
        </div>
    );
}; */}

export default StudentHome;

/* GUAGE CHART 
import './Home.css';
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { userCont } from '../App';
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';
import { controllers } from 'chart.js';



const StudentHome = () => {
    const [attendance, setAttendance] = useState([]);
    const [overallAttendance, setOverallAttendance] = useState(0);
    let [[user, setUser], [token, setToken], [isAuthenticated, setIsAuthenticated], [userType, setUserType]] = useContext(userCont);
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (token) {
                try {
                    const response = await axios.get(`http://127.0.0.1:8000/${userType}/profile/${user}`, {
                        headers: {
                            'Authorization': `Token ${token}`
                        }
                    });
                    setUserProfile(response.data.profileObj[0]);
                    setLoading(false);
                } catch (err) {
                    setError(err);
                    setLoading(false);
                }
            }
        };

        fetchUserProfile();
    }, [token, user, userType]);

    useEffect(() => {
        if (userProfile) {
            const studentId = userProfile.id;
            axios.get(`http://127.0.0.1:8000/student/attendance/${studentId}/`, {
                headers: {
                    'Authorization': `Token ${token}`
                }
            })
                .then(response => {
                    setAttendance(response.data.attendance);
                    const totalPresent = response.data.attendance.filter(attendance => attendance.status === 'PRESENT').length;
                    const totalAbsent = response.data.attendance.filter(attendance => attendance.status === 'ABSENT').length;
                    setOverallAttendance((totalPresent / (totalPresent + totalAbsent)) * 100);
                    console.log(totalAbsent,totalPresent)
                })
                .catch(error => console.error(error));
        }
    }, [userProfile]);
    console.log('overall attendance',overallAttendance);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
    const settings = {
        width: 200,
        height: 200,
        value: overallAttendance,
      };
    return (
        <div>
            <div>
                <img src={userProfile.image} alt={userProfile.studentFullName} style={{ width: '100px', height: '100px', borderRadius: '50%' }} />
                <h2>Student Full Name: {userProfile.studentFullName}</h2>
                <h2>Course ID: {userProfile.course_details}</h2>
                <h2>Batch ID:{userProfile.batch_details}</h2>
            </div>
            <div>
                <h2>Overall Attendance: {overallAttendance.toFixed(2)}%</h2>
                <Gauge
      {...settings}
      cornerRadius="50%"
      sx={(theme) => ({
        [`& .${gaugeClasses.valueText}`]: {
          fontSize: 40,
        },
        [`& .${gaugeClasses.valueArc}`]: {
          fill: '#52b202',
        },
        [`& .${gaugeClasses.referenceArc}`]: {
          fill: theme.palette.text.disabled,
        },
      })}
    />
                
            </div>
        </div>
    );
};

const Home = () => {
    let [[user, setUser], [token, setToken], [isAuthenticated, setIsAuthenticated], [userType, setUserType]] = useContext(userCont);
    return (
        <div className="home-page">
            <h1>Welcome, {user}</h1>
            {userType === 'Staff_User' ? (
                <div>
                    <h2>Staff Dashboard</h2>
                </div>
            ) : (
                <div>
                    <h2>Your Overall Performance</h2>
                    <StudentHome />
                </div>
            )}
        </div>
    );
};

export default Home;

*/
/*
import './Home.css';
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { PieChart } from 'react-minimal-pie-chart';
import { userCont } from '../App';
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';

<Gauge
  value={75}
  startAngle={-110}
  endAngle={110}
  sx={{
    [`& .${gaugeClasses.valueText}`]: {
      fontSize: 40,
      transform: 'translate(0px, 0px)',
    },
  }}
  text={
     ({ value, valueMax }) => `${value} / ${valueMax}`
  }
/>

const StudentHome = () => {
    const [attendance, setAttendance] = useState([]);
    const [overallAttendance, setOverallAttendance] = useState(0);
    let [[user, setUser], [token, setToken], [isAuthenticated, setIsAuthenticated], [userType, setUserType]] = useContext(userCont);
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (token) {
                try {
                    const response = await axios.get(`http://127.0.0.1:8000/${userType}/profile/${user}`, {
                        headers: {
                            'Authorization': `Token ${token}`
                        }
                    });
                    setUserProfile(response.data.profileObj[0]);
                    console.log('std userprofiel',userProfile)
                    setLoading(false);
                } catch (err) {
                    setError(err);
                    setLoading(false);
                }
            }
        };

        fetchUserProfile();
    }, [token, user, userType]);

    useEffect(() => {
        if (userProfile) {
            const studentId = userProfile.id;
            axios.get(`http://127.0.0.1:8000/student/attendance/${studentId}/`,{},{
                headers:{
                    'Authorization':`Token ${token}`
                }
            })
                .then(response => {
                    setAttendance(response.data.attendance);
                    console.log('Attendance',attendance);
                    const totalPresent = response.data.attendance.filter(attendance => attendance.status === 'PRESENT').length;
                    const totalAbsent = response.data.attendance.filter(attendance => attendance.status === 'ABSENT').length;
                    setOverallAttendance((totalPresent / (totalPresent + totalAbsent)) * 100);
                })
                .catch(error => console.error(error));
        }
    }, [userProfile]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div>
            <div>
                <img src={userProfile.image} alt={userProfile.studentFullName} style={{ width: '100px', height: '100px', borderRadius: '50%' }} />
                <h2>Student Full Name: {userProfile.studentFullName}</h2>
                <h2>Course ID: {userProfile.course_details}</h2>
                <h2>Batch ID:{userProfile.batch_details}</h2>
            </div>
            <div>
                <h2>Overall Attendance: {overallAttendance.toFixed(2)}%</h2>
                <PieChart
                    data={[
                        { title: 'Present', value: overallAttendance, color: '#4CAF50' },
                        { title: 'Absent', value: 100 - overallAttendance, color: '#F44336' },
                    ]}
                    lineWidth={20}
                    paddingAngle={5}
                    radius={30}
                />
            </div>
        </div>
    );
};

const Home = () => {
    let [[user, setUser], [token, setToken], [isAuthenticated, setIsAuthenticated], [userType, setUserType]] = useContext(userCont);
    return (
        <div className="home-page">
            <h1>Welcome, {user}</h1>
            {userType === 'Staff_User' ? (
                <div>
                    <h2>Staff Dashboard</h2>
                    
                </div>
            ) : (
                <div>
                    <h2>Your Overall Performance</h2>
                    <StudentHome />
                </div>
            )}
        </div>
    );
};

export default Home;
*/





/*
import './Home.css';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PieChart } from 'react-minimal-pie-chart';
import { useAuth } from '../AuthenticationProvider';
import { useContext } from 'react';
import { userCont,userObjects } from '../App';
import useUserProfile from './GetProfile';

const StudentHome = () => {
  //const {userProfile,loading,error} = useUserProfile();
  //console.log(useUserProfile());
  const [attendance, setAttendance] = useState([]);
  const [overallAttendance, setOverallAttendance] = useState(0);
  //const { token, isAuthenticated} = useAuth();
  let [[user,setUser],[token, setToken],[isAuthenticated, setIsAuthenticated],[userType, setUserType]] = useContext(userCont);
  // to get user profile
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  //let [[user,setUser],[token, setToken],[isAuthenticated, setIsAuthenticated],[userType, setUserType]] = useContext(userCont);

  const fetchUserProfile = async () => {
    if (token) {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/${userType}/profile/${user}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setUserProfile(response.data);
        console.log(userProfile);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    } 
  };
  fetchUserProfile();
  const student = userProfile;
    console.log(student);
    //console.log(stdObj);
  useEffect(() => {
    const studentId = userProfile.id; // assume studentId is stored in local storage
    axios.get(`http://127.0.0.1:8000/student/attendance/${studentId}/`)
     .then(response => {
        setAttendance(response.data);
        const totalPresent = response.data.filter(attendance => attendance.status === ('PRESENT' || 'Present')).length;
        const totalAbsent = response.data.filter(attendance => attendance.status === ('ABSENT' || 'Absent')).length;
        setOverallAttendance((totalPresent / (totalPresent + totalAbsent)) * 100);
      })
     .catch(error => console.error(error));
  }, []);

  return (
    <div>
      <div>
        <img src={student.image} alt={student.name} />
        <h2>{student.name}</h2>
      </div>
      <div>
        <h2>Overall Attendance: {overallAttendance.toFixed(2)}%</h2>
        <PieChart
          data={[
            { title: 'Present', value: overallAttendance, color: '#4CAF50' },
            { title: 'Absent', value: 100 - overallAttendance, color: '#F44336' },
          ]}
          lineWidth={20}
          paddingAngle={5}
          radius={30}
        />
      </div>
    </div>
  );
};




const Home = ({ userType, user }) => {
    return (
        <div className="home-page">
            <h1>Welcome, {user}</h1>
            {userType === 'Staff_User' ? (
                <div>
                    <h2>Staff Dashboard</h2>
                    
                </div>
            ) : (
                <div>
                    <h2>Your Overall Performance</h2>
                    
                    <StudentHome />
                </div>
            )}
        </div>
    );
};

export default Home;
*/
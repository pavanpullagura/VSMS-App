import './Navbar2.css';
import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { userCont,userObjects } from '../App';
import logo from '../images/cropped-cropped-logo-c-removebg-preview.png';
import StudentProfileOverlay from './StdProfileOverlay';
import StaffProfileOverlay from './StaffProfileOverlay';
import StudentCoursesPopup from './StudentCoursesDisplayOverlayComponent';
import PersonPinIcon from '@mui/icons-material/PersonPin';
import PublishedWithChangesOutlinedIcon from '@mui/icons-material/PublishedWithChangesOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import HomeIcon from '@mui/icons-material/Home';
import LibraryBooksOutlinedIcon from '@mui/icons-material/LibraryBooksOutlined';
import AppRegistrationOutlinedIcon from '@mui/icons-material/AppRegistrationOutlined';
import EqualizerOutlinedIcon from '@mui/icons-material/EqualizerOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ContactMailOutlinedIcon from '@mui/icons-material/ContactMailOutlined';

const Navbar = () => {
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [objid,setObjid] = useState(0);
    let [[user, setUser], [token, setToken], [isAuthenticated, setIsAuthenticated],[userType, setUserType]]= useContext(userCont);
    //let [[stdObj,setStdObj],[staffobj,setStaffobj]] = useContext(userObjects);
    let navigate = useNavigate();

    const handleLogout = () => {
        setToken(null);
        setIsAuthenticated(false);
        setUser(null);
        setUserType(null);
        navigate('/login');
    }

    const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible);
    };
    useEffect(() => {
      document.addEventListener('click', handleClickOutsideDropdown);
      return () => {
          document.removeEventListener('click', handleClickOutsideDropdown);
      };
    }, [dropdownVisible]);
    const handleClickOutsideDropdown = (event) => {
      if (dropdownVisible && !event.target.closest('.profile') && !event.target.closest('.dropdown_wrapper')) {
          setDropdownVisible(false);
      }
    };
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
                      setObjid(parseInt(response.data.profileObj[0]['id']))
                    }else{
                      setUserProfile(response.data.profileObj[0]);
                      setObjid(parseInt(response.data.profileObj[0]['id']))
                    }
                      // Assuming profileObj is an array
                    setLoading(false);
                    console.log('USER PROEJROJSEFJ',userProfile,response.data.profileObj);
                    setObjid(parseInt(response.data.profileObj[0]['id']))
                    console.log(response.data.profileObj[0]['id']);
                    console.log(objid);
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
            console.log('USER PROFILE: ', userProfile);
            setObjid(userProfile['id'])
        }
    }, [userProfile]);
    
    const [isProfileVisible, setIsProfileVisible] = useState(false);

    const handleToggleProfileVisibility = () => {
        setIsProfileVisible(!isProfileVisible);
    };
    const showPerformanceInChart = ( {id} ) =>{
      navigate(`/stdselfperformancechart/${id}`);
    }

    const [isCoursesPopupVisible, setIsCoursesPopupVisible] = useState(false);

    // Function to toggle popup visibility
    const handleToggleCoursesPopup = () => {
      setIsCoursesPopupVisible(!isCoursesPopupVisible);
    };
    return (
      <>
          {userType === 'student' && (
                <nav className="after_login_navbar">
                <div className="vcubelogo">
                  <img src={logo} alt='' height='90px' widht='250px'/>
                </div>
                    <ul className='navigation_bar'>
                        <li className='navigation_tabs'><Link to="/home"><HomeIcon sx={{fontSize:"large"}}/>HOME</Link></li>
                        <li className='navigation_tabs' onClick={handleToggleCoursesPopup}><LibraryBooksOutlinedIcon  sx={{fontSize:"large"}}/>YOUR COURSES</li>
                        <li className='navigation_tabs'><Link to="/stdattendance"><AppRegistrationOutlinedIcon sx={{fontSize:"large"}}/>YOUR DAILY ATTENDANCE</Link></li>
                        <li className='navigation_tabs'><Link to="/stdselfperformancechart"><EqualizerOutlinedIcon sx={{fontSize:"large"}}/>PERFORMANCE</Link></li>
                        <li className='navigation_tabs'><Link to="/about"><InfoOutlinedIcon sx={{fontSize:"large"}}/>ABOUT</Link></li>
                        <li className='navigation_tabs'><Link to="/contact"><ContactMailOutlinedIcon sx={{fontSize:"large"}}/>CONTACT US</Link></li>
                        {userProfile && isAuthenticated && (
                            <li className="profile navigation_tabs" onClick={toggleDropdown}>
                                <img 
                                    src={userProfile.image} 
                                    alt={userProfile.full_name} 
                                    style={{ width: '70px', height: '70px', borderRadius: '50%' }}
                                />
                                {dropdownVisible && (
                                    <div className="dropdown_wrapper dropdown_wrapper--fade-in">
                                        <section className="dropdown_group">
                                            <div className='fullname'>{userProfile.studentFullName}</div>
                                            <div >{userProfile.email}</div>
                                        </section>
                                        <hr className="divider" />
                                        <menu className='menu'>
                                            <li onClick={handleToggleProfileVisibility}><PersonPinIcon /> &nbsp;My Profile</li>
                                            <li ><Link to="/changepassword"><PublishedWithChangesOutlinedIcon />&nbsp;ChangePassword</Link></li>
                                            <li  onClick={handleLogout}><LogoutIcon />&nbsp;Logout</li>
                                        </menu>
                                    </div>
                                )}
                            </li>
                        )}
                    </ul>
                    {loading && <p>Loading profile...</p>}
                    {error && <p>Error loading profile: {error.message}</p>}
                    {isProfileVisible && (<StudentProfileOverlay stdid={objid} onClose={handleToggleProfileVisibility} />)}
                    {isCoursesPopupVisible && <StudentCoursesPopup studentId={objid} onClose={handleToggleCoursesPopup} />}
              </nav> 
            )}
            
           
            
      {userType === 'staff' && (
       
        <nav className="after_login_navbar">
          <div className="vcubelogo">
            <img src={logo} alt='' height='90px' widht='250px'/>
          </div>
                  <ul className='navigation_bar'>
                    
                        <li className='navigation_tabs'><Link to="/staff">HOME</Link></li>
                        <li className='navigation_tabs'><Link to="/dashboard/courses">COURSES</Link></li>
                        <li className='navigation_tabs'><Link to="/otherstaff">OTHER STAFF</Link></li>
                        <li className='navigation_tabs'><Link to="/about">ABOUT</Link></li>
                        <li className='navigation_tabs'><Link to="/contact">CONTACT US</Link></li>
                    
                     {userProfile && isAuthenticated && (
                      <li className="profile  navigation_tabs" onClick={toggleDropdown}>
                          
                          <img 
                              src={userProfile.image} 
                              alt={userProfile.full_name} 
                              style={{ width: '70px', height: '70px', borderRadius: '50%' }}
                          />
                          {dropdownVisible && (
                                    <div className="dropdown_wrapper dropdown_wrapper--fade-in">
                                        <section className="dropdown_group">
                                            <div className='fullname'>{userProfile.first_name}&nbsp;{userProfile.last_name}</div>
                                            <div >{userProfile.email}</div>
                                        </section>
                                        <hr className="divider" />
                                        <menu className='menu'>
                                            <li onClick={handleToggleProfileVisibility}><PersonPinIcon /> &nbsp;My Profile</li>
                                            <li ><Link to="/changepassword"><PublishedWithChangesOutlinedIcon />&nbsp;ChangePassword</Link></li>
                                            <li  onClick={handleLogout}><LogoutIcon />&nbsp;Logout</li>
                                        </menu>
                                    </div>
                                )}
                      </li>
                  )}
                  </ul>
                    {loading && <p>Loading profile...</p>}
                    {error && <p>Error loading profile: {error.message}</p>}
                    {isProfileVisible && (<StaffProfileOverlay stdid={objid} onClose={handleToggleProfileVisibility} />)}
                  
            </nav>   
          )}
          
        </>

                
               
            
      
        
        
        
    );
};

export default Navbar;


/*
import './Navbar2.css';
import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { userCont, userObjects } from '../App';

const Navbar = () => {
    const [dropdownVisible, setDropdownVisible] = useState(false);
    let [[user, setUser], [token, setToken], [isAuthenticated, setIsAuthenticated], [userType, setUserType]] = useContext(userCont);
    let navigate = useNavigate();

    const handleLogout = () => {
     
        setToken(null);
        setIsAuthenticated(false);
        setUser(null);
        setUserType(null);
        navigate('/login');
    

    
  }
  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
};
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (token) {
                try {
                    const response = await axios.get(`http://127.0.0.1:8000/${userType}/profile/${user}/`, {
                        headers: {
                            'Authorization': 'Token '+token
                        }
                    });
                    setUserProfile(response.data['profileObj']);
                    setLoading(false);
                    console.log('USER PROFILE: ',userProfile);
                    console.log('TOKEN',token);
                } catch (err) {
                    setError(err);
                    setLoading(false);
                }
            }
        };

        fetchUserProfile();
    }, [token, user, userType]);

    return (
      <nav className="navbar2">
            <ul>
                {userType !== 'staff' && (
                    <>
                        <li><Link to="/home">HOME</Link></li>
                        <li><Link to="/std-courses">YOUR COURSES</Link></li>
                        
                        <li><Link to="/performance">PERFORMANCE</Link></li>
                        <li><Link to="/about">ABOUT</Link></li>
                        <li><Link to="/contact">CONTACT US</Link></li>
                    </>
                )}
                {userType === 'staff' && (
                    <>
                        <li><Link to="/">HOME</Link></li>
                        <li><Link to="/courses">COURSES</Link></li>
                        <li><Link to="/other-staff">OTHER STAFF</Link></li>
                        <li><Link to="/about">ABOUT</Link></li>
                        <li><Link to="/contact">CONTACT US</Link></li>
                        <li onClick={handleLogout}>Logout</li>
                        
                    </>
                )}
               
           
                {userProfile?isAuthenticated && (
                    <li className="profile"  onClick={toggleDropdown}>{user}
                        <img 
                          src={userProfile.image} 
                          alt="Profile Pic" 
                          style={{ width: '50px', height: '50px', borderRadius: '50%' }}
                        />
                        {dropdownVisible && (
                            <ul>
                                <li><Link>Profile</Link></li>
                                <li onClick={handleLogout}>Logout</li>
                            </ul>
                        )}
                    </li>
                ):''}
                
            </ul>
            {loading && <p>Loading profile...</p>}
            {error && <p>Error loading profile</p>}
          </nav>
    );
};
export default Navbar;
*/

 /*
      try {
      
        console.log(token);
        const response =   axios.post(
          `http://127.0.0.1:8000/${userType}/logout/`,
          {},
          {
            headers: {
              "Authorization":'token '+token,
            },
          }
        );
        if (response.status === 200) {
          setToken('');
          setIsAuthenticated(false);
          navigate('/stafflogin');
          
        } else {
          console.error('Logout failed with status:', response.status);
        }
      } catch (error) {
        console.error('There was an error logging out!', error);
      }
    };*/
    /*
    const getStudentObj = async()=>{
      try{
       const response = await axios.post('http://127.0.0.1:8000/student/getid/',{
        'username':user
       },{
        headers:{
          'Authorization':'Token '+token
        }
       })
        setStdObj(response.data);
        //<Navigate to={`/attendance/${stdObj.id}`} />
        console.log('StudentObj',stdObj);
        console.log('StdOBJ id',stdObj[0].id);
        navigate(`/attendance/${stdObj[0].id}`)
        console.log(response.data);
        
       } catch (error) {
        console.error('Error fetching attendance data', error);
    }
    };
   
    getStudentObj();
*/  /*
    if (loading) {
      return <nav>Loading...</nav>;
    }

    if (error) {
      return <nav>Error loading profile</nav>;
    }

    
    return (
        <nav className="navbar2">
            <ul>
                {userType !== 'staffr' && (
                    <>
                        <li><Link to="/home">HOME</Link></li>
                        <li><Link to="/std-courses">YOUR COURSES</Link></li>
                        
                        <li><Link to="/performance">PERFORMANCE</Link></li>
                        <li><Link to="/about">ABOUT</Link></li>
                        <li><Link to="/contact">CONTACT US</Link></li>
                    </>
                )}
                {userType === 'staff' && (
                    <>
                        <li><Link to="/">HOME</Link></li>
                        <li><Link to="/courses">COURSES</Link></li>
                        <li><Link to="/other-staff">OTHER STAFF</Link></li>
                        <li><Link to="/about">ABOUT</Link></li>
                        <li><Link to="/contact">CONTACT US</Link></li>
                        
                    </>
                )}
               
                <li><Link to="/about">About</Link></li>
                <li><Link to="/contact">Contact Us</Link></li>
                <li className="profile">
                <img 
                  src={userProfile.staff_details.image} 
                  alt="Profile" 
                  style={{ width: '50px', height: '50px', borderRadius: '50%' }}
                />
                    {dropdownVisible && (
                        <div className="dropdown">
                            <Link to="/profile">{userProfile.username}</Link>
                            <Link to="/changepassword">Change Password</Link>
                            <button onClick={handleLogout}>Logout</button>
                        </div>
                    )}
                </li>
                <li>{token?'':<Link to="/login">LOGIN</Link>}</li>
            </ul>
        </nav>
    );
};

export default Navbar;

*/

/*
import React, { useState,useContext } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import { userCont } from './App';
import logoPic from "./images/cropped-cropped-logo-c-removebg-preview.png";

const Navbar = () => {
    let [[user,setUser],[token, setToken],[isAuthenticated, setIsAuthenticated]] = useContext(userCont);
    const [showLoginOptions, setShowLoginOptions] = useState(false);
  
    const handleLoginClick = () => {
      setShowLoginOptions(!showLoginOptions);
      console.log(showLoginOptions);
    };
  
    return (
        <>
        
      <nav className="navbar">
         
        <ul>
            
          <li>
            <Link to="/">HOME</Link>
          </li>
          {isAuthenticated ? (
            <li>
            <a href="#" onClick={handleLoginClick}>
              {user}
            </a>
            {showLoginOptions ? (
              <ul className="login-options">
                <li className='login_option'>
                  <Link to="/staff-login">Profile</Link>
                </li>
                <li className='login_option'>
                  <Link to="/student-login">LOGOUT</Link>
                </li>
              </ul>
            ):''}
          </li>
          ) : (
            <li onClick={handleLoginClick} className='dropbtn'>
              
                LOGIN
              
              {showLoginOptions && (
                <ul className="login-options">
                  <li>
                    <Link to="/stafflogin">STAFF LOGIN</Link>
                  </li>
                  <li>
                    <Link to="/std">STUDENT LOGIN</Link>
                  </li>
                </ul>
              )}
            </li>
          )}
        </ul>
      </nav>
      </>
    );
  };
  
export default Navbar;
*/
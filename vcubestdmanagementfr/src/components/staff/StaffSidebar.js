import './StaffSidebar.css';
import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { userCont } from '../../App';
import logo1 from '../../images/cropped-cropped-logo-c-removebg-preview.png';
//import StudentProfileOverlay from './StdProfileOverlay';
import StaffProfileOverlay from '.././StaffProfileOverlay';
//import StudentCoursesPopup from './StudentCoursesDisplayOverlayComponent';
import PersonPinIcon from '@mui/icons-material/PersonPin';
import PublishedWithChangesOutlinedIcon from '@mui/icons-material/PublishedWithChangesOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import HomeIcon from '@mui/icons-material/Home';
import LibraryBooksOutlinedIcon from '@mui/icons-material/LibraryBooksOutlined';
import AppRegistrationOutlinedIcon from '@mui/icons-material/AppRegistrationOutlined';
import EqualizerOutlinedIcon from '@mui/icons-material/EqualizerOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ContactMailOutlinedIcon from '@mui/icons-material/ContactMailOutlined';

const StaffSidebar = () => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [objid, setObjid] = useState(0);
  let [[user, setUser], [token, setToken], [isAuthenticated, setIsAuthenticated], [userType, setUserType]] = useContext(userCont);
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
          if (userType == 'staff') {
            setUserProfile(response.data.profileObj[0]);
            setObjid(parseInt(response.data.profileObj[0]['id']))
          } else {
            setUserProfile(response.data.profileObj[0]);
            setObjid(parseInt(response.data.profileObj[0]['id']))
          }
          setLoading(false);
          console.log('USER PROEJROJSEFJ', userProfile, response.data.profileObj);
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




  return (
    <div className="sidebar">
      <div className="logofor_side">
        <img src={logo1} alt='' height='90px' width='250px' />
      </div>
      <ul className='sidebar_menu'>
        {userType === 'staff' && (
          <>
            <li className='sidebar_item'>
              <Link to="/staff">
                <HomeIcon /> HOME
              </Link>
            </li>
            <li className='sidebar_item'>
              <Link to="/dashboard/courses">
                <LibraryBooksOutlinedIcon /> COURSES
              </Link>
            </li>
            <li className='sidebar_item'>
              <Link to="/otherstaff">
                <AppRegistrationOutlinedIcon /> OTHER STAFF
              </Link>
            </li>
            <li className='sidebar_item'>
              <Link to="/about">
                <InfoOutlinedIcon /> ABOUT
              </Link>
            </li>
            <li className='sidebar_item'>
              <Link to="/contact">
                <ContactMailOutlinedIcon /> CONTACT US
              </Link>
            </li>
          </>
        )}
        {userProfile && isAuthenticated && (
          <li className="profile sidebar_item" onClick={toggleDropdown}>
            <img
              src={userProfile.image}
              alt={userProfile.full_name}
              style={{ width: '40px', height: '40px', borderRadius: '50%' }}
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
    </div>
  );
};

export default StaffSidebar;
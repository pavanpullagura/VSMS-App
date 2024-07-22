import './Navbar.css';
import React, { useState,useContext } from 'react';
import { Link } from 'react-router-dom';
import { userCont } from './App';
import logoPic from "./images/cropped-cropped-logo-c-removebg-preview.png";

const StaffSidebar = () => {
  return (
    <aside className="sidebar">
      <h2></h2>
      <Link to='/std'><img src={logoPic}  height="90px" width="200px"/></Link>
      <ul>
        <li>
          <Link to="/all-courses">ALL COURSES</Link>
        </li>
        <li>
          <Link to="/all-batches">ALL BATCHES</Link>
        </li>
        <li>
          <Link to="/all-students-performance">ALL STUDENTS PERFORMANCE</Link>
        </li>
        <li><Link to="/registerstd">REGISTER NEW STUDENT</Link></li>
        <li>
          <Link to="/logout">LOGOUT</Link>
        </li>
      </ul>
    </aside>
  );
};

const StudentSidebar = () => {
  return (
    <aside className="sidebar">
      <h2>Student Sidebar</h2>
      <Link to='/std'><img src={logoPic}  height="90px" width="200px"/></Link>
      <ul>
        <li>
          <Link to="/my-courses">MY COURSES</Link>
        </li>
        <li>
          <Link to="/my-batches">MY BATCHES</Link>
        </li>
        <li>
          <Link to="/my-performance">MY PERFORMANCE</Link>
        </li>
        <li>
          <Link to="/stdlogout">LOGOUT</Link>
        </li>
      </ul>
    </aside>
  );
};

const DefaultSidebar = () => {
    const [activeTab, setActiveTab] = useState('');
  
    const handleTabClick = (tab) => {
      setActiveTab(tab);
    };
  
    return (
      <aside className="sidebar">
        <Link to='/std'><img src={logoPic}  height="90px" width="200px"/></Link>
        
        <ul>
          <li>
            <Link
              to="/all-courses"
              className={activeTab === 'all-courses' ? 'active' : ''}
              onClick={() => handleTabClick('all-courses')}
            >
              ALL COURSES
            </Link>
          </li>
          <li>
            <Link
              to="/all-batches"
              className={activeTab === 'all-batches' ? 'active' : ''}
              onClick={() => handleTabClick('all-batches')}
            >
              IMAGES
            </Link>
          </li>
          <li>
            <Link
              to="/all-students-performance"
              className={activeTab === 'all-students-performance' ? 'active' : ''}
              onClick={() => handleTabClick('all-students-performance')}
            >
              ABOUT US
            </Link>
          </li>
          <li>CONTACT US</li>
          <li><Link to="/login">LOGIN</Link></li>
        </ul>
      </aside>
    );
  };

const Sidebar = () => {
    let [[user,setUser],[token, setToken],[isAuthenticated, setIsAuthenticated],[userType, setUserType]] = useContext(userCont);
    
  

    if (user && userType=='Staff_User') {
        return <StaffSidebar />;
    } else if (user && !userType) {
        return <StudentSidebar />;
    } else {
        return <DefaultSidebar />;
    }
};

export default Sidebar;


/*
const Sidebar = () => {
  const [activeTab, setActiveTab] = useState('');

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <aside className="sidebar">
      <h2>Sidebar</h2>
      <ul>
        <li>
          <Link
            to="/all-courses"
            className={activeTab === 'all-courses' ? 'active' : ''}
            onClick={() => handleTabClick('all-courses')}
          >
            ALL COURSES
          </Link>
        </li>
        <li>
          <Link
            to="/all-batches"
            className={activeTab === 'all-batches' ? 'active' : ''}
            onClick={() => handleTabClick('all-batches')}
          >
            ALL BATCHES
          </Link>
        </li>
        <li>
          <Link
            to="/all-students-performance"
            className={activeTab === 'all-students-performance' ? 'active' : ''}
            onClick={() => handleTabClick('all-students-performance')}
          >
            ALL STUDENTS PERFORMANCE
          </Link>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
*/
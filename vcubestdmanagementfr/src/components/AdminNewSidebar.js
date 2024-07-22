import React, { useState } from 'react';

const AdminNewSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleCreateClick = () => {
    setIsCreateOpen(!isCreateOpen);
  };

  const handleProfileClick = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const handleSidebarClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="container">
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="logo">
          <img src="your-logo.png" alt="Logo" />
          <h2>joe ui</h2>
        </div>
        <div className="menu-container">
          <ul>
            <li>
              <a href="#">
                <i className="fas fa-home"></i>
                <span>Home</span>
              </a>
            </li>
            <li>
              <a href="#">
                <i className="fas fa-cog"></i>
                <span>Settings</span>
              </a>
            </li>
            <li onClick={handleCreateClick}>
              <a href="#">
                <i className="fas fa-plus-square"></i>
                <span>Create</span>
                <i className={`fas fa-caret-down ${isCreateOpen ? 'rotate-180' : ''}`}></i>
              </a>
              <ul className={`submenu ${isCreateOpen ? 'open' : ''}`}>
                <li>
                  <a href="#">Article</a>
                </li>
                <li>
                  <a href="#">Document</a>
                </li>
                <li>
                  <a href="#">Video</a>
                </li>
                <li>
                  <a href="#">Presentation</a>
                </li>
                {/* Add more items here */}
                <li>
                  <a href="#">Item 5</a>
                </li>
                <li>
                  <a href="#">Item 6</a>
                </li>
                <li>
                  <a href="#">Item 7</a>
                </li>
                <li>
                  <a href="#">Item 8</a>
                </li>
              </ul>
            </li>
            <li onClick={handleProfileClick}>
              <a href="#">
                <i className="fas fa-user"></i>
                <span>Profile</span>
                <i className={`fas fa-caret-down ${isProfileOpen ? 'rotate-180' : ''}`}></i>
              </a>
              <ul className={`submenu ${isProfileOpen ? 'open' : ''}`}>
                <li>
                  <a href="#">Products</a>
                </li>
                <li>
                  <a href="#">Account</a>
                </li>
                {/* Add more items here */}
                <li>
                  <a href="#">Item 9</a>
                </li>
                <li>
                  <a href="#">Item 10</a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
      <div className={`main ${isOpen ? 'open' : ''}`} onClick={handleSidebarClick}>
        {/* Your main content area here */}
      </div>
    </div>
  );
};

export default AdminNewSidebar;
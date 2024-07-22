
import './ChangePassword.css';
import React, { useContext, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { userCont } from '../App';
import { useAuth } from '../AuthenticationProvider';
import BackButton from './BackButtonFunctionality';

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  let [[user, setUser], [token, setToken], [isAuthenticated, setIsAuthenticated], [userType, setUserType]] = useContext(userCont);
  const navigate = useNavigate();

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/adminuser/change-password/', {
        old_password: oldPassword,
        new_password: newPassword,
      }, {
        headers: {
          'Authorization': 'Token '+token
        }
      });
      console.log(token,isAuthenticated);
      alert(response.data.message);
      navigate('/home');  // Redirect to home or any other page after successful password change
    } catch (err) {
      setError(err.response.data.old_password || err.response.data.new_password || 'An error occurred');
    }
  };

  return (
   <div className='changepassdivmain'>
    <div><BackButton /></div>
     <div className='change_pass_div'>
      <h2>Change Password</h2>
      <form onSubmit={handleChangePassword} className='password_change_form'>
        <div>
          <label>Old Password</label>
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Change Password</button>
      </form>
    </div>
   </div>
  );
};

export default ChangePassword;

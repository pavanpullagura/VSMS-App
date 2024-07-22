
import './StaffForgotPassword.css';
import React, { useState } from 'react';
import axios from 'axios';
import BackButton from './BackButtonFunctionality';

const StudentForgotPassword = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1);

  const handleForgotPassword = e => {
    e.preventDefault();
    axios.post('http://127.0.0.1:8000/student/forgotpassword/', { username, email })
      .then(response => {
        alert('OTP sent to your email');
        setStep(2);
      })
      .catch(error => console.error(error));
  };

  const handleResetPassword = e => {
    e.preventDefault();
    axios.post('http://127.0.0.1:8000/student/reset-password/', { username, otp, new_password: newPassword })
      .then(response => {
        alert('Password reset successfully');
        setStep(1);
      })
      .catch(error => console.error(error));
  };

  return (

    <div className='staff_forgotpass_maindiv'>
      <div><BackButton /></div>
      {step === 1 && (
        <form onSubmit={handleForgotPassword}  className='forgotpass_std_form'>
          <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" /><br/>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" /><br/>
          <button type="submit">Send OTP</button>
        </form>
      )}
      {step === 2 && (
        <form onSubmit={handleResetPassword}  className='forgotpass_std_form'>
          <input type="text" value={otp} onChange={e => setOtp(e.target.value)} placeholder="OTP" /><br/>
          <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="New Password" /><br/>
          <button type="submit">Reset Password</button>
        </form>
      )}
    </div>
  );
};

export default StudentForgotPassword;

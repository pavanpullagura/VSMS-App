import './StaffForgotPassword.css';
import React, { useState } from 'react';
import axios from 'axios';
import BackButton from './BackButtonFunctionality';

const ForgotPasswordForStaff = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1);

  const handleForgotPassword = e => {
    e.preventDefault();
    axios.post('http://127.0.0.1:8000/adminuser/forgotpassword/', { username, email })
      .then(response => {
        alert('OTP sent to your email');
        setStep(2);
      })
      .catch(error => {
        console.error(error);
        if (error.response) {
          alert(`Error: ${error.response.data.error}`);
        } else {
          alert('An unexpected error occurred');
        }
      });
  };

  const handleResetPassword = e => {
    e.preventDefault();
    axios.post('http://127.0.0.1:8000/adminuser/reset-password/', { username, otp, new_password: newPassword })
      .then(response => {
        alert('Password reset successfully');
        setStep(1);
      })
      .catch(error => console.error(error));
  };

  return (
    <>
    <div><BackButton /></div>
    <div className='staff_forgotpass_maindiv'>
      {step === 1 && (
        <form onSubmit={handleForgotPassword} className='forgotpass_std_form'>
          <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" /><br/>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" /><br/>
          <button type="submit">Send OTP</button>
        </form>
      )}
      {step === 2 && (
        <form onSubmit={handleResetPassword} className='restpass_std_form'>
          <input type="text" value={otp} onChange={e => setOtp(e.target.value)} placeholder="OTP" /><br/>
          <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="New Password" /><br/>
          <button type="submit">Reset Password</button>
        </form>
      )}
    </div>
    </>
  );
};

export default ForgotPasswordForStaff;

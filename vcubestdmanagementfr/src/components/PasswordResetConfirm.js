// PasswordResetConfirm.js
import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const PasswordResetConfirm = () => {
    const { uidb64, token } = useParams();
    const [newPassword, setNewPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`/api/reset-password-confirm/${uidb64}/${token}/`, { new_password: newPassword });
            alert(response.data.message);
        } catch (error) {
            console.error('There was an error resetting the password!', error);
            alert('Error resetting the password.');
        }
    };

    return (
        <div>
            <h2>Set New Password</h2>
            <form onSubmit={handleSubmit}>
                <input 
                    type="password" 
                    value={newPassword} 
                    onChange={(e) => setNewPassword(e.target.value)} 
                    placeholder="Enter new password" 
                    required 
                />
                <button type="submit">Set New Password</button>
            </form>
        </div>
    );
};

export default PasswordResetConfirm;

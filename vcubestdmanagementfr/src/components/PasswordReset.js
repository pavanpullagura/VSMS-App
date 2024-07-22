// PasswordReset.js
import React, { useState } from 'react';
import axios from 'axios';

const PasswordReset = () => {
    const [email, setEmail] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/reset-password/', { email });
            alert(response.data.message);
        } catch (error) {
            console.error('There was an error resetting the password!', error);
            alert('Error resetting the password.');
        }
    };

    return (
        <div>
            <h2>Reset Password</h2>
            <form onSubmit={handleSubmit}>
                <input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    placeholder="Enter your email" 
                    required 
                />
                <button type="submit">Reset Password</button>
            </form>
        </div>
    );
};

export default PasswordReset;

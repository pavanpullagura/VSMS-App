import React from 'react';
import { useNavigate } from 'react-router-dom';
import './BackButton.css';

const BackButton = () => {
    const navigate = useNavigate();

    const handleBack = () => {
        navigate(-1);  // This will navigate back to the previous page
    };

    return (
        <button onClick={handleBack} className="back-button">
            Go Back
        </button>
    );
};

export default BackButton;

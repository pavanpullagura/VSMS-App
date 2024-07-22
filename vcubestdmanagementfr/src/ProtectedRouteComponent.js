import React, { useContext, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { userCont } from './App';
import './ProtectedRouteComponent.css';

const ProtectedRoute = ({ children }) => {
    const [isAuthenticated] = useContext(userCont)[2];
    const [showPopup, setShowPopup] = useState(false);

    if (!isAuthenticated) {
        setShowPopup(true);
        return (
            <div>
                {showPopup && (
                    <div className="popup">
                        <p>Please login to use this component</p>
                        <button onClick={() => setShowPopup(false)}>Close</button>
                    </div>
                )}
                <Navigate to="/login" replace />
            </div>
        );
    }

    return children;
};

export default ProtectedRoute;

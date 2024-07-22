// src/components/Profile.js
import React, { useState } from 'react';
import axios from 'axios';

const Profile = ({ user }) => {
    const [image, setImage] = useState(null);
    const [profileData, setProfileData] = useState(user);

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleProfileUpdate = () => {
        const formData = new FormData();
        formData.append('image', image);

        axios.put(`http://127.0.0.1:8000/profile-picture/${user.id}/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Token ${localStorage.getItem('token')}`
            }
        })
            .then(response => {
                console.log('Profile picture updated successfully');
                setProfileData({ ...profileData, image: URL.createObjectURL(image) });
            })
            .catch(error => console.error('Error updating profile picture:', error));
    };

    return (
        <div>
            <h1>Profile</h1>
            <div className="profile-container">
                <div className="profile-left">
                    <img src={profileData.image} alt="Profile" />
                    <input type="file" onChange={handleImageChange} />
                    <button onClick={handleProfileUpdate}>Update Profile Picture</button>
                </div>
                <div className="profile-right">
                    <p><strong>Full Name:</strong> {profileData.studentFullName}</p>
                    <p><strong>Username:</strong> {profileData.username}</p>
                    <p><strong>Email:</strong> {profileData.email}</p>
                    <p><strong>Contact Number:</strong> {profileData.contact_num}</p>
                    <p><strong>Joining Date:</strong> {profileData.joining_date}</p>
                    <p><strong>Course Details:</strong> {profileData.course_details}</p>
                    <p><strong>Batch Details:</strong> {profileData.batch_details}</p>
                </div>
            </div>
        </div>
    );
};

export default Profile;

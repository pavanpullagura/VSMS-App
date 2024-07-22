// src/components/ProfilePictureUpdate.js
import React, { useState } from 'react';
import axios from 'axios';

const ProfilePictureUpdate = ({ user }) => {
    const [image, setImage] = useState(null);

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleProfilePictureUpdate = () => {
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
                window.location.reload();
            })
            .catch(error => console.error('Error updating profile picture:', error));
    };

    return (
        <div>
            <h1>Update Profile Picture</h1>
            <input type="file" onChange={handleImageChange} />
            <button onClick={handleProfilePictureUpdate}>Update</button>
        </div>
    );
};

export default ProfilePictureUpdate;

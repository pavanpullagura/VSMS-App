import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { userCont } from '../App';
import './ProfileOverlay.css';

const StudentProfileOverlay = ({ stdid, onClose }) => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [image, setImage] = useState(null);
    const [formData, setFormData] = useState({});
    const [[user, setUser], [token, setToken], [isAuthenticated, setIsAuthenticated], [userType, setUserType]] = useContext(userCont);
    const navigate = useNavigate();
    const [showOverlay, setShowOverlay] = useState(true); // State variable to toggle overlay visibility

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/student/profileinfo/${stdid}/`, {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                });
                setProfile(response.data);
                setLoading(false);
            } catch (err) {
                setError(err);
                setLoading(false);
            }
        };

        fetchProfile();
    }, [token, stdid]);

    const handleImageChange = (event) => {
        setImage(event.target.files[0]);
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const handleDrop = (event) => {
        event.preventDefault();
        const files = event.dataTransfer.files;
        if (files && files[0]) {
            setImage(files[0]);
        }
    };

    const handleFormChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
        console.log('form data',formData);
    };

    const handleProfileUpdate = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.put(`http://127.0.0.1:8000/student/profileinfo/${stdid}/`, formData, {
                headers: {
                    Authorization: `Token ${token}`,
                },
            });
            setProfile(response.data);
            setFormData({});
            alert('Profile Data Updated Successfully!');
        } catch (err) {
            setError(err);
        }
    };

    const handleImageUpload = async (event) => {
        event.preventDefault();
        try {
            const formDataWithImage = new FormData();
            if (image) {
                formDataWithImage.append('image', image);
            }
            await axios.put(`http://127.0.0.1:8000/student/profile-picture/${stdid}/`, formDataWithImage, {
                headers: {
                    Authorization: `Token ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            setImage(null);
            alert('Profile Picture Updated Successfully!');
        } catch (err) {
            setError(err);
        }
    };

    const handleClickOutside = (event) => {
        if (!event.target.closest('.profile-overlay')) {
            setShowOverlay(false);
            onClose();
        }
        onClose();
    };
    console.log('Progile',profile);

    return (
        <div className="profile-overlay" style={{ display: showOverlay ? 'block' : 'none' }}>
            {loading ? (
                <p>Loading profile...</p>
            ) : (
                <>
                    <div className='overlayadjustmentdiv'>
                        <form onSubmit={handleProfileUpdate} className='std_profile_update_form'>
                            <div id='closebtn'>
                                <button type="button" onClick={handleClickOutside} className='profile_close_btn'>Close</button>
                            </div>
                            <label>
                                Full Name:
                                <input type="text" name="full_name" value={formData.studentFullName || profile.studentFullName} placeholder={profile.studentFullName} onChange={handleFormChange} />
                            </label>
                            <label>
                                Contact Number:
                                <input type="number" name="contact_num" value={formData.contact_num || profile.contact_num} onChange={handleFormChange} />
                            </label>
                            <label>
                                Email:
                                <input type="email" name="email" value={formData.email || profile.email} onChange={handleFormChange} />
                            </label>
                            <button type="submit">Update Profile</button>
                        </form>
                        
                        <form onSubmit={handleImageUpload} className='std_profile_update_form' encType="multipart/form-data">
                            {profile.image && <img src={profile.image} alt={profile.studentFullName} height="50px" width="50px" />}
                            <div className="dropzone-area" onDragOver={handleDragOver} onDrop={handleDrop}>
                                <p>Click to upload or drag and drop</p>
                                <input type="file" onChange={handleImageChange} />
                                <p className="file-info">{image ? image.name : 'No Files Selected'}</p>
                            </div>
                            <button type="submit">Update Profile Picture</button>
                        </form>
                    </div>
                </>
            )}
            {error && <p>Error: {error.message}</p>}
        </div>
    );
};

export default StudentProfileOverlay;



/*
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { userCont } from '../App';
import './ProfileOverlay.css';

const StudentProfileOverlay = ({ stdid, onClose }) => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [image, setImage] = useState(null);
    const [formData, setFormData] = useState({});
    const [[user, setUser], [token, setToken], [isAuthenticated, setIsAuthenticated], [userType, setUserType]] = useContext(userCont);

    const navigate = useNavigate();

    const [showOverlay, setShowOverlay] = useState(true); // State variable to toggle overlay visibility

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/student/profileinfo/${stdid}/`, {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                });
                setProfile(response.data);
                setLoading(false);
            } catch (err) {
                setError(err);
                setLoading(false);
            }
        };

        fetchProfile();
    }, [token, stdid]);

    const handleImageChange = (event) => {
        setImage(event.target.files[0]);
    };

    const handleFormChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };

    const handleProfileUpdate = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.put(`http://127.0.0.1:8000/student/profileinfo/${stdid}/`, formData, {
                headers: {
                    Authorization: `Token ${token}`,
                },
            });
            setProfile(response.data);
            setFormData({});
            alert('Profile Data Updated Successfully!');
        } catch (err) {
            setError(err);
        }
    };

    const handleImageUpload = async (event) => {
        event.preventDefault();
        try {
            const formDataWithImage = new FormData();
            console.log('image',event);
            setImage(event.target.files);
            if (image) {
                console.log('image uploaded')
                formDataWithImage.append('image', image);
            }

            await axios.put(`http://127.0.0.1:8000/student/profile-picture/${stdid}/`, formDataWithImage, {
                headers: {
                    Authorization: `Token ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
        
            setImage(null);
            alert('Profile Picture Updated Successfully!');
        } catch (err) {
            setError(err);
        }
    };

    const handleClickOutside = (event) => {
        if (!event.target.closest('.profile-overlay')) {
            setShowOverlay(false);
            onClose();
        }
        onClose();
    };

    return (
        <div className="profile-overlay" style={{ display: showOverlay ? 'block' : 'none' }}>
            {loading ? (
                <p>Loading profile...</p>
            ) : (
                <>
                    <div className='overlayadjustmentdiv'>
                    <form onSubmit={handleProfileUpdate} className='std_profile_update_form'>
                        <div id='closebtn'>
                            <button type="button" onClick={handleClickOutside}>Close</button>
                        </div>
                        
                        <label>
                            Full Name:
                            <input type="text" name="full_name" value={formData.studentFullName || profile.studentFullName} onChange={handleFormChange} />
                        </label>
                        <label>
                            Contact Number:
                            <input type="number" name="contact_num" value={formData.contact_num || profile.contact_num} onChange={handleFormChange} />
                        </label>
                        <label>
                            Email:
                            <input type="email" name="email" value={formData.email || profile.email} onChange={handleFormChange} />
                        </label>
                        <button type="submit">Update Profile</button>
                    </form>
                    
                    <form onSubmit={handleImageUpload} className='std_profile_update_form'>
                        {profile.image && <img src={profile.image} alt={profile.full_name} height="50px" width="50px" />}
                        <input type="file" onChange={handleImageChange} />
                        <button type="submit">Update Profile Picture</button>
                    </form>

                    <form class="dropzone-box">
                            
                            <h2>Upload file</h2>
                            <p>Click to upload or drag and drop</p>
                            <div class="dropzone-area">
                          
                                <div class="file-upload-icon">
                                </div>
                                <input type="file" required id="upload-file" name="uploaded-file" accept="image" />
                                <p class="file-info">No Files Selected</p>
                            </div>
                            <div class="dropzone-description">
                                <span>Max file size: 25MB</span>
                            </div>
                            <div class="dropzone-actions"> 
                                <div class="dropzone-help"> Help Center </div> 
                                <div>
                                    <button type="reset">Cancel</button>
                                    <button id="submit-button" type="submit"> Save </button>
                                </div>
                            </div>
                            </form>
                    </div>
                </>
            )}
            {error && <p>Error: {error.message}</p>}
        </div>
    );
};

export default StudentProfileOverlay;
*/





/*
import React, { useState, useEffect,useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { userCont } from '../App';
import './ProfileOverlay.css';

const ProfileOverlay = ( {stdid}) => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [image, setImage] = useState(null);
    const [formData, setFormData] = useState({});
    let [[user, setUser], [token, setToken], [isAuthenticated, setIsAuthenticated],[userType, setUserType]]= useContext(userCont);

    const navigate = useNavigate();
    

    const [visible, setVisible] = useState(false);

    const handleToggleVisibility = () => {
        setVisible(!visible);
    };

    const handleClickOutside = (event) => {
        if (!event.target.closest('.profile-overlay')) {
        setVisible(false);
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        return () => {
        document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const fetchProfile = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/student/profileinfo/${stdid}/`, {
            headers: {
                Authorization: `Token ${token}`,
            },
            });
            console.log('Profile response',response.data);
            setProfile(response.data);
            console.log(profile);
            setLoading(false);
        } catch (err) {
            setError(err);
            setLoading(false);
        }
        };

        fetchProfile();
    }, [token, user]);

    const handleImageChange = (event) => {
        setImage(event.target.files[0]);
    };

    const handleFormChange = (event) => {
        setFormData({...formData, [event.target.name]: event.target.value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
        const formDataWithImage = new FormData();
        formDataWithImage.append('image', image);
        Object.keys(formData).forEach((key) => {
            formDataWithImage.append(key, formData[key]);
        });

        const response = await axios.put(`http://127.0.0.1:8000/student/profile-picture/${stdid}/`, formDataWithImage, {
            headers: {
            Authorization: `Token ${token}`,
            'Content-Type': 'ultipart/form-data',
            },
        });
        setProfile(response.data);
        setImage(null);
        setFormData({});
        } catch (err) {
        setError(err);
        }
    };

    return (
        <div className={`profile-overlay ${visible ? 'visible' : ''}`}>
        {loading? (
            <p>Loading profile...</p>
        ) : (
            <form onSubmit={handleSubmit} className='std_profile_update_form'>
                <div id='closebtn'><button onClick={handleToggleVisibility}>Close</button></div>
            <img src={profile.image} alt={profile.full_name} /> 
            <input type="file" name="image" onChange={handleImageChange} />
            
            <label>
                Full Name:
                <input type="text" name="full_name" defaultValue={formData.studentFullName || profile.studentFullName} onChange={handleFormChange} />
            </label>
            <label>
                Email:
                <input type="email" name="email" value={formData.email || profile.email} onChange={handleFormChange} />
            </label>
            <button type="submit">Update Profile</button>
            </form>
            
        )}
        {error && <p>Error: {error.message}</p>}
        
        </div>
    );
};

export default ProfileOverlay;
*/
/*
// Profile.js
import React, { useState,useContext } from 'react';
import axios from 'axios';
import { userCont } from '../App';

const Profile = ({ user }) => {
    let [[user, setUser], [token, setToken], [isAuthenticated, setIsAuthenticated],[userType, setUserType]]= useContext(userCont);
    const [profileImage, setProfileImage] = useState(user.profilePicture);

    const handleImageChange = async (event) => {
        const file = event.target.files[0];
        const formData = new FormData();
        formData.append('profile_picture', file);

        try {
            const response = await axios.post('/api/profile-picture-upload/', formData, {
                headers: {
                    'Authorization':'Token '+token,
                    'Content-Type': 'multipart/form-data',
                },
            });
            setProfileImage(response.data.profile_picture);
        } catch (error) {
            console.error('There was an error uploading the profile picture!', error);
        }
    };

    return (
        <div className="profile-page">
            <div className="left-side">
                <img src={profileImage} alt="Profile" />
                <input type="file" onChange={handleImageChange} />
            </div>
            <div className="right-side">
                <h2>{user.studentFullName}</h2>
                <p>Email: {user.email}</p>
                <p>Contact: {user.contact}</p>
                <p>Course: {user.course}</p>
                <p>Batch: {user.batch}</p>
                
            </div>
        </div>
    );
};


 

export default Profile;
*/
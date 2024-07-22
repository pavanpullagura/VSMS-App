import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { userCont } from '../App';
import './ProfileOverlay.css';
import BackupOutlinedIcon from '@mui/icons-material/BackupOutlined';

const StaffProfileOverlay = ({ stdid, onClose }) => {
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
                const response = await axios.get(`http://127.0.0.1:8000/staff/profileinfo/${stdid}/`, {
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
    
    const handleProfileUpdate = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.put(`http://127.0.0.1:8000/staff/profileinfo/${stdid}/`, formData, {
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

            await axios.put(`http://127.0.0.1:8000/staff/profile-picture/${stdid}/`, formDataWithImage, {
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
                                <button type="button" onClick={handleClickOutside}  className='profile_close_btn'>Close</button>
                            </div>
                            <div className='profileinputdiv'>
                            <input type="text" name="first_name" placeholder='First Name' className='adminprofileinputfield' value={formData.first_name || profile.first_name} onChange={handleFormChange} />
                            <label className='adminprofilelabeltag' >First Name:</label>
                        </div>
                        <div className='profileinputdiv'>
                            <input type="text" name="last_name" placeholder='Last Name' className='adminprofileinputfield'  value={formData.last_name || profile.last_name} onChange={handleFormChange} />
                            <label className='adminprofilelabeltag' >Last Name:</label>
                        </div>
                            <label>
                                Contact Number:
                                <input type="number" name="contact_num" value={formData.contact_num || profile.contact_num} onChange={handleFormChange} />
                            </label>
                            <label>
                                Email:
                                <input type="email" name="email" value={formData.email || profile.email} onChange={handleFormChange} />
                            </label>
                            <button type="submit" className='update_btn'>Update Profile</button>
                        </form>
                        
                        <form onSubmit={handleImageUpload} className='std_profile_update_form' encType="multipart/form-data">
                            {profile.image && <img src={profile.image} alt={profile.full_name} height="50px" width="50px" />}
                            <div className="dropzone-area" onDragOver={handleDragOver} onDrop={handleDrop}>
                                <BackupOutlinedIcon sx={{fontSize:'80px'}}/>
                                <p>Click to upload or drag and drop</p>
                                <input type="file" onChange={handleImageChange} />
                                <p className="file-info">{image ? image.name : 'No Files Selected'}</p>
                            </div>
                            <button type="submit" className='update_btn'>Update Profile Picture</button>
                        </form>
                    </div>
                </>
            )}
            {error && <p>Error: {error.message}</p>}
        </div>
        
    );
};

export default StaffProfileOverlay;


/*
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { userCont } from '../App';
import './ProfileOverlay.css';

const StaffProfileOverlay = ({ stdid, onClose }) => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [image, setImage] = useState(null);
    const [formData, setFormData] = useState({});
    let [[user, setUser], [token, setToken], [isAuthenticated, setIsAuthenticated], [userType, setUserType]] = useContext(userCont);

    const navigate = useNavigate();

    const [showOverlay, setShowOverlay] = useState(true); // New state variable to toggle overlay visibility

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/staff/profileinfo/${stdid}/`, {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                });
                console.log('Profile response', response.data);
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
        //console.log('files',event.target.files);
        setImage(event.target.files[0]);
        console.log('image',image,event.target.files[0])
    };

    const handleFormChange = (event) => {
        setFormData({...formData, [event.target.name]: event.target.value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log('FORMSData',formData);
        try {
            const formDataWithImage = new FormData();
            formDataWithImage.append('image', image);
            Object.keys(formData).forEach((key) => {
                formDataWithImage.append(key, formData[key]);
            });
            console.log('form data image',formDataWithImage);

            const response = await axios.put(`http://127.0.0.1:8000/staff/profile-picture/${stdid}/`, formDataWithImage, {
                headers: {
                    Authorization: `Token ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            setProfile(response.data);
            setImage(null);
            setFormData({});
        } catch (err) {
            setError(err);
        }
    };
    const handleClickOutside = (event) => {
        setShowOverlay(false);
        if (!event.target.closest('.profile-overlay')) {
            
            onClose();
        }
        onClose();
    };

    return (
        <div className="profile-overlay" style={{ display: showOverlay ? 'block' : 'none' }}>
            {loading ? (
                <p>Loading profile...</p>
            ) : (
                <form onSubmit={handleSubmit} className='std_profile_update_form'>
                    <div id='closebtn'>
                        <button onClick={(event) =>handleClickOutside(event)}>Close</button>
                    </div>
                    <img src={profile.image} alt={profile.full_name} height="50px" width="50px" />
                    <input type="file"  onChange={handleImageChange} />

                    <label>
                        Full Name:
                        <input type="text" name="full_name" value={formData.full_name || profile.full_name} onChange={handleFormChange} />
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
            )}
            {error && <p>Error: {error.message}</p>}
        </div>
    );
};

export default StaffProfileOverlay;
*/
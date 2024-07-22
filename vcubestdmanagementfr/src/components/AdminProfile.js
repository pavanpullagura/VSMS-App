import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { userCont } from '../App';
import './ProfileOverlay.css';
import BackButton from './BackButtonFunctionality';

const AdminProfile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [image, setImage] = useState(null);
    const [formData, setFormData] = useState({});
    const [[user, setUser], [token, setToken], [isAuthenticated, setIsAuthenticated], [userType, setUserType]] = useContext(userCont);
    const [adminId, setAdminId] = useState(0);
    const navigate = useNavigate();

    const [showOverlay, setShowOverlay] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/adminuser/profile/${user}/`, {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                });
                const profileData = response.data['profileObj'][0];
                setProfile(profileData);
                setAdminId(profileData['id']);
                setLoading(false);
            } catch (err) {
                setError(err);
                setLoading(false);
            }
        };

        fetchProfile();
    }, [token]);

    const handleImageChange = (event) => {
        setImage(event.target.files[0]);
    };

    const handleFormChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };
    
    const handleProfileUpdate = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.put(`http://127.0.0.1:8000/adminuser/profileupdate/${adminId}/`, formData, {
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

            const response = await axios.put(`http://127.0.0.1:8000/adminuser/profilepictureupdate/${adminId}/`, formDataWithImage, {
                headers: {
                    Authorization: `Token ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
        
            setProfile({ ...profile, image: response.data.image });
            setImage(null);
            alert('Profile Picture Updated Successfully!');
        } catch (err) {
            setError(err);
        }
    };

    return (
        <div className="profile-overlay" style={{ display: showOverlay ? 'block' : 'none' }}>
            {loading ? (
                <p>Loading profile...</p>
            ) : (
                <>
                <div className='admin_profile_overlay_outer_div'>
                    <div><BackButton/></div>
                
                    <div className='overlayadjustmentdiv'>
                    
                    <form onSubmit={handleProfileUpdate} className='std_profile_update_form'>
                        
                        <div className='profileinputdiv'>
                            <input type="text" name="first_name" placeholder='First Name' className='adminprofileinputfield' value={formData.first_name || profile.first_name} onChange={handleFormChange} />
                            <label className='adminprofilelabeltag' >First Name:</label>
                        </div>
                        <div className='profileinputdiv'>
                            <input type="text" name="last_name" placeholder='Last Name' className='adminprofileinputfield'  value={formData.last_name || profile.last_name} onChange={handleFormChange} />
                            <label className='adminprofilelabeltag' >Last Name:</label>
                        </div>
                        <div className='profileinputdiv'>
                            <input type="number" name="contact_num" placeholder='Contact Number' className='adminprofileinputfield'  value={formData.contact_num || profile.contact_num} onChange={handleFormChange} />
                            <label className='adminprofilelabeltag' >Mobile Number:</label>
                        </div>
                        <div className='profileinputdiv'>
                            <input type="email" name="email" placeholder='Email ID' className='adminprofileinputfield'  value={formData.email || profile.email} onChange={handleFormChange} />
                            <label className='adminprofilelabeltag' >Email ID:</label>
                        </div>
                        <button type="submit" className='update_btn'>Update Profile</button>
                    </form>
                   
                    <form onSubmit={handleImageUpload} className='std_profile_update_form'>
                        {profile.image && <img src={profile.image} alt={profile.first_name} height="100px" width="100px" />}
                        <input type="file" className='adminprofileimageinputfield'  onChange={handleImageChange} />
                        <button type="submit" className='imageuploadbtn_at_adminprofile update_btn'>Update Profile Picture</button>
                        <p className='changepass_atprofileoverlay'>Want to change password<Link to='/changepassword'><span>Click Here.</span></Link></p>
                    </form>
                    
                    </div>
                </div>
                </>
            )}

            {error && <p>Error: {error.message}</p>}
        </div>
    );
};

export default AdminProfile;

/*
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate,Link } from 'react-router-dom';
import { userCont } from '../App';
import './ProfileOverlay.css';

const AdminProfile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [image, setImage] = useState(null);
    const [formData, setFormData] = useState({});
    const [[user, setUser], [token, setToken], [isAuthenticated, setIsAuthenticated], [userType, setUserType]] = useContext(userCont);
    let [adminId,setAdminId] = useState(0);
    const navigate = useNavigate();

    const [showOverlay, setShowOverlay] = useState(true); // State variable to toggle overlay visibility

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/adminuser/profile/${user}/`, {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                });
                setProfile(response.data['profileObj'][0]);
                setAdminId(profile['id']);
                console.log(profile['id'],adminId);
                console.log('pProgile',profile,'resp',response.data);
                setLoading(false);
            } catch (err) {
                setError(err);
                setLoading(false);
            }
            setAdminId(profile['id']);
        };

        fetchProfile();
    }, [token]);

    const handleImageChange = (event) => {
        setImage(event.target.files[0]);
    };

    const handleFormChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };
    
    const handleProfileUpdate = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.put(`http://127.0.0.1:8000/adminuser/profileupdate/${adminId}/`, formData, {
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
            console.log(event.target.form,event.target.files);
            setImage(event.target.value);
            if (image) {
                console.log('image uploaded')
                formDataWithImage.append('image', image);
            }

            await axios.put(`http://127.0.0.1:8000/adminuser/profilepictureupdate/${adminId}/`, formDataWithImage, {
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


    return (
        <div className="profile-overlay" style={{ display: showOverlay ? 'block' : 'none' }}>
            {loading ? (
                <p>Loading profile...</p>
            ) : (
                <>
                    <div>
                    <form onSubmit={handleProfileUpdate} className='std_profile_update_form'>
                        
                        
                        
                            <input type="text" name="full_name" placeholder='Full Name' value={formData.full_name || profile.full_name} onChange={handleFormChange} />
                       
                        
                            <input type="number" name="contact_num" placeholder='Contact Number' value={formData.contact_num || profile.contact_num} onChange={handleFormChange} />
                        
                     
                            <input type="email" name="email" placeholder='Email ID' value={formData.email || profile.email} onChange={handleFormChange} />
                        
                        <button type="submit">Update Profile</button>
                    </form>
                    </div>
                    <div>
                    <form onSubmit={handleImageUpload} className='std_profile_update_form'>
                        {profile.image && <img src={profile.image} alt={profile.full_name} height="50px" width="50px" />}
                        <input type="file" onChange={handleImageChange} />
                        <button type="submit">Update Profile Picture</button>
                    </form>
                    <Link to='/changepassword'><p>ChangePassword</p></Link>
                    </div>
                </>
            )}

            {error && <p>Error: {error.message}</p>}
        </div>
    );
};

export default AdminProfile;
*/


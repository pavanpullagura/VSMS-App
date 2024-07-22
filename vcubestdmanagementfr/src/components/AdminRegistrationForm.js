import React, { useState, useContext } from 'react';
import axios from 'axios';
import { userCont } from '../App';
import './AdminRegistrationForm.css';
import BackButton from './BackButtonFunctionality';

const AdminRegistrationForm = () => {
    let [[user, setUser], [token, setToken], [isAuthenticated, setIsAuthenticated], [userType, setUserType]] = useContext(userCont);
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        username: '',
        email: '',
        contact_num: '',
        joining_date: '',
        gender: '',
        image: null
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleFileChange = (e) => {
        setFormData({
            ...formData,
            image: e.target.files[0]
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': 'Token ' + token
            }
        };
        
        const form_data = new FormData();
        for (const key in formData) {
            form_data.append(key, formData[key]);
        }
        
        try {
            const response = await axios.post('http://127.0.0.1:8000/adminuser/register-admin/', form_data, config);
            alert(response.data.message);
        } catch (error) {
            console.error('There was an error registering the admin!', error);
        }
    };

    return (
        <>
        <div><BackButton /></div>
        <div className='admin_reg_div'>
            <form onSubmit={handleSubmit}>
                <div className='admin_registration_form_part1'>
                    <div className='input_wrapper'>
                        <input type="text" name="first_name" placeholder="First Name" value={formData.first_name} onChange={handleChange} required className='input_field'/>
                        <label className='input_label'>First Name:</label>
                    </div>
                    <div className='input_wrapper'>
                        <input type="text" name="username" className='input_field' placeholder='Username' value={formData.username} onChange={handleChange} required />
                        <label className='input_label'>Username:</label>
                    </div>
                    <div className='input_wrapper'>
                        <input type="number" name="contact_num" className='input_field' placeholder='Contact Number' value={formData.contact_num} onChange={handleChange} required />
                        <label className='input_label'>Contact Number:</label>
                    </div>
                </div>
                <div className='admin_registration_form_part2'>
                    <div className='input_wrapper'>
                        <input type="text" name="last_name" placeholder="Last Name" value={formData.last_name} onChange={handleChange} required className='input_field'/>
                        <label className='input_label'>Last Name:</label>
                    </div>
                    <div className='input_wrapper'>
                        <input type="email" name="email" className='input_field' placeholder='Email' value={formData.email} onChange={handleChange} required />
                        <label className='input_label'>Email:</label>
                    </div>
                    <div className='input_wrapper'>
                        <input type="date" name="joining_date" className='input_field' placeholder='Joining Date' value={formData.joining_date} onChange={handleChange} required />
                        <label className='input_label'>Joining Date:</label>
                    </div>
                </div>
                <div className='admin_registration_form_part3'>
                <div className='input_wrapper'>
                    <label className='input_label'>Gender:</label>
                    <div className='radio_group'>
                        <label className='input_radio_label'>
                            <input type="radio" name="gender" value="male" checked={formData.gender === 'male'} onChange={handleChange} />
                            Male
                        </label>
                        <label className='input_radio_label'>
                            <input type="radio" name="gender" value="female" checked={formData.gender === 'female'} onChange={handleChange} />
                            Female
                        </label>
                        <label className='input_radio_label'>
                            <input type="radio" name="gender" value="other" checked={formData.gender === 'other'} onChange={handleChange} />
                            Other
                        </label>
                    </div>
                </div>
                <div className='input_wrapper input_profile_image_uploader'>
                    <label className='input_label'>Profile Image:</label>
                    <input type="file" name="image" className='input_field' onChange={handleFileChange} />
                </div>
                <button type="submit">Register Admin</button>
                </div>
            </form>
        </div>
        </>
    );
};

export default AdminRegistrationForm;

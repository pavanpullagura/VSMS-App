import React, { useState } from 'react';
import axios from 'axios';
import './Contact.css';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        contact_num: '',
        message: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://127.0.0.1:8000/staff/contact-us/', formData)
            .then(response => {
                alert('Message sent successfully');
                setFormData({
                    name: '',
                    email: '',
                    contact_num: '',
                    message: ''
                });
            })
            .catch(error => {
                console.error('There was an error sending the message!', error);
            });
    };

    return (
        <div className='contactdiv'>
            <section className="contact" id="contact">
                <form onSubmit={handleSubmit}>
                    <h2>Contact Us</h2>
                    <input 
                        type="text" 
                        name="name" 
                        placeholder="Your Name" 
                        value={formData.name}
                        onChange={handleChange}
                        required 
                    /><br/>
                    <input type="text"  name="contact_num"  placeholder="Your Mobile Number"    value={formData.contact_num} onChange={handleChange}  required  /><br/>
                    <input   type="email"  name="email"  placeholder="Your Email"  value={formData.email}   onChange={handleChange}  required  /><br/>
                    <textarea   name="message"  placeholder="Your Message" cols='40'  value={formData.message} onChange={handleChange} required ></textarea><br/>
                    <button type="submit">Send Message</button>
                </form>
                <div className="contact-info">
                    <p>Phone: (123) 456-7890</p>
                    <p>Email: vcube@ittraininginstitute.com</p>
                    <p>Address: 2nd Floor Above Raymond's Clothing Store KPHB, Phase-1, Kukatpally, Hyderabad</p>
                </div>
            </section>
        </div>
    );
};

export default Contact;

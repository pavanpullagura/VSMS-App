import React, { useState, useEffect } from 'react';
import './AllDepartments.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
import BackButton from './BackButtonFunctionality';
import Modal from 'react-modal';

function AllDepartments() {
    const [data, setData] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState(null);

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/adminuser/departments/').then((resp) => {
            console.log(resp);
            setData(resp.data);
        }).catch((error) => {
            console.log('error raised');
            console.log(error);
        });
    }, []);

    const openModal = (dept) => {
        setSelectedDepartment(dept);
    };

    const closeModal = () => {
        setSelectedDepartment(null);
    };

    return (
        <>
            <div><BackButton /></div>
            <section className="departments" id="departments">
                <h2>Our Departments</h2>
                <div className="departments-list">
                    {data.map(dept => (
                        <div key={dept.department_id} className="department" onClick={() => openModal(dept)}>
                            <h3><span>{dept.department_id}</span> {dept.departmanet_name}</h3>
                            <p>Total Staff: {dept.staff.length}</p>
                        </div>
                    ))}
                </div>
            </section>
            {selectedDepartment && (
                <Modal
                    isOpen={!!selectedDepartment}
                    onRequestClose={closeModal}
                    contentLabel="Staff Details"
                    className="modal"
                    overlayClassName="overlay"
                >
                    <h2>{selectedDepartment.departmanet_name}</h2>
                    <button onClick={closeModal} className="close-button">Close</button>
                    <div className="staff-list">
                        {selectedDepartment.staff.map(staff => (
                            <div key={staff.id} className="staff">
                                <div>
                                    <p><strong>Name:</strong> {staff.first_name} {staff.last_name}</p>
                                    <p><strong>Contact:</strong> {staff.contact_num}</p>
                                    <p><strong>Email:</strong> {staff.email}</p>
                                    <p><strong>Address:</strong> {staff.address}</p>
                                </div>
                                <div style={{backgroundImage:`url(http://127.0.0.1:8000${staff.image})`,backgroundSize: 'cover', backgroundPosition: 'center',height:'150px',width:'150px'}}>
                                    
                                </div>
                                
                            </div>
                        ))}
                    </div>
                </Modal>
            )}
        </>
    );
};

export default AllDepartments;

import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import { userCont } from '../../App';
import './NewEnrolledStudentsList.css';

const NewEnrolledStudentsList = () => {
    let [[user,setUser],[token, setToken],[isAuthenticated, setIsAuthenticated],[userType, setUserType]] = useContext(userCont);
    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
    const [studentToDelete, setStudentToDelete] = useState(null);

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/staff/enrollments/', {
            headers: {
                'Authorization': 'Token ' + token
            }
        })
        .then(response => {
            setStudents(response.data);
        })
        .catch(error => {
            console.error('Error fetching students:', error);
        });
    }, [token]);

    const openModal = (student) => {
        setSelectedStudent(student);
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setSelectedStudent(null);
        setModalIsOpen(false);
    };

    const openDeleteModal = (student) => {
        setStudentToDelete(student);
        setDeleteModalIsOpen(true);
    };

    const closeDeleteModal = () => {
        setStudentToDelete(null);
        setDeleteModalIsOpen(false);
    };

    const handleDelete = () => {
        if (studentToDelete) {
            axios.delete(`http://127.0.0.1:8000/staff/enrollments/${studentToDelete.id}/`, {
                headers: {
                    'Authorization': 'Token ' + token
                }
            })
            .then(response => {
                setStudents(students.filter(student => student.id !== studentToDelete.id));
                closeDeleteModal();
            })
            .catch(error => {
                console.error('Error deleting student:', error);
            });
        }
    };

    const handleCall = (phoneNumber) => {
        window.location.href = `tel:${phoneNumber}`;
    };

    const handleMail = (email) => {
        window.location.href = `mailto:${email}`;
    };

    return (
        <div className='enrolledlist_main_div'>
            <div>
                <h2 className='heading_for_enrolledList'>Enrolled Students</h2>
                <div className='enrolledstds_tabs'>
                    {students.map((student) => (
                        <div key={student.id} className='students_tabs_newly_enrolled'>
                            Name:&nbsp;{student.studentFirstName} {student.studentLastName}<br/> 
                            Graduation:&nbsp;{student.graduation}<br/>
                            Specialization:&nbsp;{student.specialization}
                            <div className='some_btns_div'>
                                <button onClick={() => openModal(student)} className='seemore_btn'>More Details</button>
                                <button className='delete_btn' onClick={() => openDeleteModal(student)}>Delete</button>
                            </div>
                        </div>
                    ))}
                </div>

                {selectedStudent && (
                    <Modal isOpen={modalIsOpen} onRequestClose={closeModal} contentLabel="Student Details">
                        <div className='modal-content'>
                            <h2>{selectedStudent.studentFirstName} {selectedStudent.studentLastName}</h2>
                            <p>Date of Birth: {selectedStudent.dateOfBirth}</p>
                            <p>Graduation: {selectedStudent.graduation}</p>
                            <p>Specialization: {selectedStudent.specialization}</p>
                            <p>Passed Out Year: {selectedStudent.passedOutYear}</p>
                            <p>Address: {selectedStudent.address}</p>
                            <p>Gender: {selectedStudent.gender}</p>
                            <p>Email: {selectedStudent.email}</p>
                            <p>Contact Number: {selectedStudent.contact_num}</p>
                            <p>Selected Course: {selectedStudent.selectCourse.name}</p>
                            <p>Joining Month Preference: {selectedStudent.joiningMonthPreference}</p>
                            <button onClick={() => handleCall(selectedStudent.contact_num)}>Call</button>
                            <button onClick={() => handleMail(selectedStudent.email)}>Mail</button>
                            <button onClick={closeModal}>Close</button>
                        </div>
                    </Modal>
                )}

                {studentToDelete && (
                    <Modal isOpen={deleteModalIsOpen} onRequestClose={closeDeleteModal} contentLabel="Confirm Delete">
                        <div className='modal-content'>
                            <h2>Confirm Delete</h2>
                            <p>Do you want to delete {studentToDelete.studentFirstName} {studentToDelete.studentLastName}?</p>
                            <button onClick={handleDelete}>DELETE</button>
                            <button onClick={closeDeleteModal}>Cancel</button>
                        </div>
                    </Modal>
                )}
            </div>
        </div>
    );
};

export default NewEnrolledStudentsList;

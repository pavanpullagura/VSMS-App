import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import './StudentCoursesPopup.css';
import { userCont } from '../App';

const StudentCoursesPopup = ({ studentId, onClose }) => {
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCourse, setSelectedCourse] = useState(null);
    let [[user, setUser], [token, setToken], [isAuthenticated, setIsAuthenticated], [userType, setUserType]] = useContext(userCont);

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/student/${studentId}/courses/`, {
                    headers: {
                        'Authorization': 'Token ' + token
                    }
                });
                setCourse(response.data);
                setLoading(false);
            } catch (err) {
                setError(err);
                setLoading(false);
            }
        };

        fetchCourse();
    }, [studentId, token]);

    const handleLearnMore = () => {
        setSelectedCourse(course);
    };

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                
                {loading && <p>Loading course...</p>}
                {error && <p>Error loading course: {error.message}</p>}
                {!loading && !error && course && (
                    <>
                    <button className="close-button" onClick={onClose}>Close</button>
                    <div>
                        <h2>Your Course</h2>
                        <h3>{course.courseName}</h3>
                        <button onClick={handleLearnMore}>Learn More</button>
                        {selectedCourse && (
                            <div className="course-description">
                                <h3>{selectedCourse.courseName}</h3>
                                <p>{selectedCourse.description}</p>
                            </div>
                        )}
                    </div>
                    </>
                )}
                {!loading && !error && !course && (
                    <p>No course found for this student</p>
                )}
            </div>
        </div>
    );
};

export default StudentCoursesPopup;



/*
import React, { useEffect, useState , useContext} from 'react';
import axios from 'axios';
import './StudentCoursesPopup.css';
import { userCont } from '../App';

const StudentCoursesPopup = ({ studentId, onClose }) => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCourse, setSelectedCourse] = useState(null);
    let [[user, setUser], [token, setToken], [isAuthenticated, setIsAuthenticated],[userType, setUserType]] = useContext(userCont);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/student/${studentId}/courses/`, {
                    headers: {
                        'Authorization': 'Token ' + token
                    }
                });
                setCourses(response.data);
                console.log(courses,response);
                setLoading(false);
            } catch (err) {
                setError(err);
                setLoading(false);
            }
        };

        fetchCourses();
    }, [studentId]);

    const handleLearnMore = (courseId) => {
        const course = courses.find(c => c.id === courseId);
        setSelectedCourse(course);
    };

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <button className="close-button" onClick={onClose}>Close</button>
                {loading && <p>Loading courses...</p>}
                {error && <p>Error loading courses: {error.message}</p>}
                {!loading && !error && (
                    <div>
                        <h2>Your Courses</h2>
                        <ul>
                            {courses.map(course => (
                                <li key={course.id}>
                                    <h3>{course.courseName}</h3>
                                    <button onClick={() => handleLearnMore(course.id)}>Learn More</button>
                                </li>
                            ))}
                        </ul>
                        {selectedCourse && (
                            <div className="course-description">
                                <h3>{selectedCourse.courseName}</h3>
                                <p>{selectedCourse.description}</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentCoursesPopup;
*/
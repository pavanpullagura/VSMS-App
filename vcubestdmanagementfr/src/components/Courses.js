
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BackButton from './BackButtonFunctionality';

const Courses = ({ user }) => {
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        axios.get(`/api/students/${user.id}/courses/`)
            .then(response => setCourses(response.data))
            .catch(error => console.error('There was an error fetching courses!', error));
    }, [user.id]);

    return (
        <>
        <div><BackButton /></div>
        <div className="courses-page">
            <h2>Your Courses</h2>
            <ul>
                {courses.map(course => (
                    <li key={course.id}>{course.name}</li>
                ))}
            </ul>
        </div>
        </>
    );
};

export default Courses;

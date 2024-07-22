import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import './DetailedDescriptionOfCourse.css';
import BackButton from "./BackButtonFunctionality";

function DetailedDescriptionAboutCourses() {
    let { courseId } = useParams();
    const [course, setCourse] = useState(null);

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/staff/allcourses/')
            .then((resp) => {
                const courseData = resp.data.find(c => c.id === parseInt(courseId));
                setCourse(courseData);
                console.log(course,courseData);
            })
            .catch((error) => {
                console.log('Error raised:', error);
            });
    }, [courseId]);

    if (!course) {
        return <div>Loading...</div>;
    }

    return (
        <>
        <div><BackButton /></div>
        <section className="course-detail-div" id="course-detail">
            <div className="coursedesc">
                <h3>{course.courseName}</h3>
                <p>{course.description}</p>
            </div>
        </section>
        </>
    );
}

export default DetailedDescriptionAboutCourses;

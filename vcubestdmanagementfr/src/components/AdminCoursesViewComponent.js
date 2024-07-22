import React, {useState,useEffect} from 'react';
import './AllCourses.css';
import axios from 'axios';
import { Link } from 'react-router-dom';

function AdminCoursesViewComponent(){
    const [data,setData] = useState([]);
    
    useEffect(()=>{
        axios.get('http://127.0.0.1:8000/staff/allcourses/').then((resp)=>{
            console.log(resp);
            setData(resp.data);
        }
        ).catch((error)=>{
            console.log('error raised');
            console.log(error);
            
        })
    },[])
        

    return (
        <section className="courses" id="courses">
            <h2>Our Courses</h2>
            <div className="course-list">
                {data.map(course => (
                    <div key={course.id} className="course" style={{backgroundImage:`url(http://127.0.0.1:8000${course.course_image})`,backgroundSize: 'cover', backgroundPosition: 'center'}}>
                        <h3>{course.courseName}</h3>
                        
                        <Link to={`/adminbatches/${course.id}`}><button className="cta">See Batches</button></Link>
                        
                    </div>
                ))}
            </div>
        </section>
    );
};

export default AdminCoursesViewComponent;

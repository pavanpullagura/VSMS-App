import { userCont,courseContext } from "./App";
import { useContext,useState,useEffect } from "react";
import { Link,useNavigate } from "react-router-dom";
import axios from "axios";
import { useParams } from "react-router-dom";
import './coursescomponent.css';
import BackButton from "./components/BackButtonFunctionality";

function CoursesComponent(){
  const [batches, setBatches] = useState([]);
  let [courses,setCourses] = useContext(courseContext);
  let [[user, setUser], [token, setToken], [isAuthenticated, setIsAuthenticated],[userType, setUserType]]= useContext(userCont);
  let navigate = useNavigate();

  useEffect(()=>{
    axios.get('http://127.0.0.1:8000/staff/allcourses/').then((resp)=>{
        console.log(resp);
        setCourses(resp.data);
    }
    ).catch((error)=>{
        console.log('error raised');
        console.log(error);
        
    })
},[])

    return(
        <>
        <div className="courses-container">
            
            <h1>Courses</h1>
            <ul className="course-list">
                <div><BackButton /></div>
                {courses.map((c) => (
                <li key={c.id} className="course-item">
                    <Link to={`/courses/${c.id}/batches`}>{c.id}. {c.courseName}</Link>
                </li>
                ))}
            </ul>
        </div>
        </>
    );
}
/*

const BatchesDetails=()=>{
    const { courseId } = useParams();
    const [batches, setBatches] = useState([]);

    useEffect(() => {
        fetch(`http://127.0.0.1:8000/staff/courses/${courseId}/batches`) // Replace with your API endpoint
            .then(response => response.json())
            .then(data => setBatches(data));
    }, [courseId]);
    return (
        <>
        <div>
            <h1>Batches for Course ID: {courseId}</h1>
            <ul>
                {batches.map(batch => (
                    <li key={batch.id}>{batch.name}</li>
                ))}
            </ul>
        </div>
        </>
    );
}
    */
export default CoursesComponent;
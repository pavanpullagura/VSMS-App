import { useContext, useState, useEffect } from "react";
import { userCont } from "../../App";
import axios from "axios";
import './AddNewBatch.css';
import BackButton from "../BackButtonFunctionality";

function AddNewBatch(){
    let [[user,setUser],[token, setToken],[isAuthenticated, setIsAuthenticated],[userType, setUserType]] = useContext(userCont);
    let [courses,setCourses] = useState([]);
    let [courseid,setCourseid] = useState(0);
    let [batchname,setBatchname] = useState('');
        
    useEffect(()=>{
        axios.get('http://127.0.0.1:8000/staff/allcourses/',{
            headers:{
                'Authorization':'Token '+token
            }
        }).then((resp)=>{
            console.log(resp);
            setCourses(resp.data);
            console.log('coursesObjexts',courses);
        }
        ).catch((error)=>{
            console.log('error raised');
            console.log(error);
                
        })
    },[])

    
    const handleAddBatch = async (e) => {
        e.preventDefault();
        try {
            axios.post('http://127.0.0.1:8000/staff/addbatch/',{
                'course':courseid,
                'Batch_name':batchname
            },{
                headers:{
                    'Authorization':'Token '+token
                }
            })
            alert('Batch Added Successfully');
        } catch (error) {
            console.error('Error While Adding Batch', error);
        }
    };

    
    return(
        <>
        <div className="addBatchDiv">
        <div><BackButton/></div>
            <div className="container">
            <form onSubmit={handleAddBatch} className="add_batch_form">
                <select onChange={(e)=>{setCourseid(e.target.value)}} className="select-input">
                <option value="">Select Course</option>
                    {courses.map(c=>(
                        <option key={c.id} value={c.id}>{c.courseName}</option>
                    ))}
                </select><br/>
                <input type="text" placeholder="Batch Name" onChange={(e)=>{setBatchname(e.target.value)}}  className="input-field"/>
                <button type="submit">Add Batch</button>
            </form>
            </div>
        </div>
        
        </>
    );
}
export default AddNewBatch;
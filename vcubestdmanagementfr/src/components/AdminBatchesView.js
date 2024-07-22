import { useParams,Link } from "react-router-dom";
import { useState,useEffect } from "react";
import '.././coursescomponent.css';
import BackButton from "./BackButtonFunctionality";

function AdminBatchesView(){
    const { courseId } = useParams();
    const [batches, setBatches] = useState([]);

    useEffect(() => {
        fetch(`http://127.0.0.1:8000/staff/courses/${courseId}/batches`) // Replace with your API endpoint
            .then(response => response.json())
            .then(data => setBatches(data));
    }, [courseId]);
    console.log(batches);
    console.log('course id',courseId);
    return (
        <>
        <div><BackButton /></div>
        <div className="outerbatchesdiv">
        <div className="batches_mainlinksdiv">
            <h3>See all students details</h3>
            <div className="subdivforBatches">
            <h3>Batches for Course ID: {courseId}</h3>
            <ul>
                {batches.map(batch => (
                    <li key={batch.id}>{batch.Batch_name}</li>
                ))}
            </ul>
            </div>
        </div>
        
        </div>
        </>
    );
}
export default AdminBatchesView;
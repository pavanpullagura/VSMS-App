import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import './coursescomponent.css';
import BackButton from "./components/BackButtonFunctionality";

function BatchDetails() {
    const { courseId } = useParams();
    const [batches, setBatches] = useState([]);

    useEffect(() => {
        fetch(`http://127.0.0.1:8000/staff/courses/${courseId}/batches`) // Replace with your API endpoint
            .then(response => response.json())
            .then(data => setBatches(data));
    }, [courseId]);
    
    return (
        <div className="batch-details-container">
            <div className="batch-details-header">
                <BackButton />
                <h2>Batches for Course ID: {courseId}</h2>
            </div>
            <div className="batch-details-content">
                <div className="batch-section">
                    <h3>See all students Attendance by their Batch</h3>
                    <div className="batch-list">
                        <ul>
                            {batches.map(batch => (
                                <li key={batch.id}>
                                    <Link to={`/batches/attendance/${courseId}/${batch.id}`}>
                                        {batch.Batch_name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="batch-section">
                    <h3>Select Batches for Updating the Students Attendance</h3>
                    <div className="batch-list">
                        <ul>
                            {batches.map(batch => (
                                <li key={batch.id}>
                                    <Link to={`/batches/attendance/modify/${courseId}/${batch.id}`}>
                                        {batch.Batch_name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BatchDetails;

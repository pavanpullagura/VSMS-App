import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CourseBatchManager.css';

const CourseBatchManager = () => {
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [batches, setBatches] = useState([]);
    const [selectedBatch, setSelectedBatch] = useState(null);
    const [showBatchPopup, setShowBatchPopup] = useState(false);

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        const response = await axios.get('http://127.0.0.1:8000/staff/createcourses/');
        setCourses(response.data);
    };

    const fetchBatches = async (courseId) => {
        const response = await axios.get(`http://127.0.0.1:8000/staff/courses/${courseId}/batches/`);
        setBatches(response.data);
    };

    const handleCourseChange = (course) => {
        setSelectedCourse(course);
        fetchBatches(course.id);
    };

    const handleBatchChange = (batch) => {
        setSelectedBatch(batch);
        setShowBatchPopup(true);
    };

    const handleBatchUpdate = async (batchId, batchName) => {
        await axios.patch(`http://127.0.0.1:8000/staff/batches/${batchId}/`, { Batch_name: batchName });
        fetchBatches(selectedCourse.id);
        setShowBatchPopup(false);
    };

    const handleBatchDelete = async (batchId) => {
        await axios.delete(`/api/batches/${batchId}/`);
        fetchBatches(selectedCourse.id);
        setShowBatchPopup(false);
    };

    return (
        <div>
            <h2>Course and Batch Management</h2>
            <div>
                <label>Select Course:</label>
                <select onChange={(e) => handleCourseChange(courses.find(course => course.id === parseInt(e.target.value)))}>
                    <option value="">Select a Course</option>
                    {courses.map(course => (
                        <option key={course.id} value={course.id}>{course.courseName}</option>
                    ))}
                </select>
            </div>
            {selectedCourse && (
                <div>
                    <h3>{selectedCourse.courseName}</h3>
                    <button onClick={() => setShowBatchPopup(true)}>Modify Course</button>
                </div>
            )}
            {selectedCourse && (
                <div>
                    <h4>Batches</h4>
                    {batches.map(batch => (
                        <div key={batch.id}>
                            <span>{batch.Batch_name}</span>
                            <button onClick={() => handleBatchChange(batch)}>Modify Batch</button>
                        </div>
                    ))}
                </div>
            )}
            {showBatchPopup && selectedBatch && (
                <div className="batch_popup">
                    <h3>Modify Batch</h3>
                    <label>Batch Name:</label>
                    <input
                        type="text"
                        defaultValue={selectedBatch.Batch_name}
                        onChange={(e) => setSelectedBatch({ ...selectedBatch, Batch_name: e.target.value })}
                    />
                    <button onClick={() => handleBatchUpdate(selectedBatch.id, selectedBatch.Batch_name)}>Save</button>
                    <button onClick={() => handleBatchDelete(selectedBatch.id)}>Delete</button>
                    <button onClick={() => setShowBatchPopup(false)}>Cancel</button>
                </div>
            )}
        </div>
    );
};

export default CourseBatchManager;

import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { userCont } from '../App';
import './SearchAndSubmit.css';
import BackButton from './BackButtonFunctionality';

const SearchAndSubmitTest = () => {
  let [[user, setUser], [token, setToken], [isAuthenticated, setIsAuthenticated], [userType, setUserType]] = useContext(userCont);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('name');
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [allbatches, setAllbatches] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('');
  const [testReports, setTestReports] = useState([]);
  const [mockReports, setMockReports] = useState([]);
  const [testDate, setTestDate] = useState('');
  const [obtainedMarks, setObtainedMarks] = useState('');
  const [totalMarks, setTotalMarks] = useState('');
  const [interviewDate, setInterviewDate] = useState('');
  const [obtainedScore, setObtainedScore] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [courseId, setCourseId] = useState(0);
  const [isTestReportPopupOpen, setIsTestReportPopupOpen] = useState(false);
  const [isMockReportPopupOpen, setIsMockReportPopupOpen] = useState(false);
  const [editingTestReport, setEditingTestReport] = useState(null);
  const [editingMockReport, setEditingMockReport] = useState(null);
  const [totalStudents, setTotalStudents] = useState(0);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/staff/allstudents/', {
      headers: {
        'Authorization': 'Token ' + token
      }
    }).then((resp) => {
      setStudents(resp.data['stdData']);
      setTotalStudents(students.length);
      setFilteredStudents(resp.data['stdData']);
    });
  }, [token]);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/staff/courses/', {
      headers: {
        'Authorization': 'Token ' + token
      }
    })
      .then(response => {
        setCourses(response.data);
      })
      .catch(error => console.error(error));
  }, [token]);
  

  useEffect(() => {
    if (courseId) {
      axios.get(`http://127.0.0.1:8000/staff/courses/${courseId}/batches`, {
        headers: {
          'Authorization': 'Token ' + token
        }
      })
        .then(response => {
          setBatches(response.data);
        })
        .catch(error => console.error(error));
    } else {
      setBatches([]);
    }
  }, [courseId]);

  useEffect(() => {
      axios.get(`http://127.0.0.1:8000/staff/allbatches/`, {
        headers: {
          'Authorization': 'Token ' + token
        }
      }).then(response => {
          setAllbatches(response.data);
          //console.log('batches all',allbatches,response.data);
        }).catch(error => console.error(error));
    
    });
  //console.log(students);
  const handleSearch = () => {
    
    const query = searchQuery.toLowerCase();
    
    const filtered = students.filter(std => {
      console.log(std,std[searchType]);
      const value = std[searchType].toString().toLowerCase();
      return value.includes(query);
    });
    setFilteredStudents(filtered);
    setTotalStudents(filteredStudents.length);
  };

  const handleCourseChange = (courseId) => {
    setSelectedCourse(courseId);
    setCourseId(courseId);
    const filtered = students.filter(student => student.course_details === courseId);
    setFilteredStudents(filtered);
    setTotalStudents(filtered.length);
  };

  const handleBatchChange = (batchId) => {
    setSelectedBatch(parseInt(batchId));
    const filtered = students.filter(student => student.batch_details === parseInt(batchId));
    setFilteredStudents(filtered);
    setTotalStudents(filtered.length);
  };
  

  const getCourseName = (courseId) => {
    const course = courses.find(course => course.id === courseId);
    return course ? course.courseName : 'N/A';
  };

  const getBatchName = (batchId) => {
   // console.log(allbatches,batchId);
    const batch = allbatches.find(batch => batch.id === batchId);
    return batch ? batch.Batch_name : 'N/A';
  };

  const fetchReports = (studentId) => {
    axios.get(`http://127.0.0.1:8000/staff/student_reports/${studentId}/`, {
      headers: {
        'Authorization': 'Token ' + token
      }
    })
      .then(response => {
        if (response.data.hasTestReport) {
          axios.get(`http://127.0.0.1:8000/staff/weekly_test_reports/${studentId}/`, {
            headers: {
              'Authorization': 'Token ' + token
            }
          })
            .then(res => setTestReports(res.data))
            .catch(error => console.error(error));
        } else {
          setTestReports([]);
        }

        if (response.data.hasMockReport) {
          axios.get(`http://127.0.0.1:8000/staff/mock_interview_reports/${studentId}/`, {
            headers: {
              'Authorization': 'Token ' + token
            }
          })
            .then(res => setMockReports(res.data))
            .catch(error => console.error(error));
        } else {
          setMockReports([]);
        }
      })
      .catch(error => console.error(error));
  };

  const handleStudentSelect = (student) => {
    setSelectedStudent(student);
    setTestDate('');
    setObtainedMarks('');
    setTotalMarks('');
    setInterviewDate('');
    setObtainedScore(0);
    setTotalScore(0);
    fetchReports(student.id);
  };

  const handleSubmitTestReport = () => {
    const testReport = {
      student: selectedStudent.id,
      test_date: testDate,
      obtained_marks: obtainedMarks,
      total_marks: totalMarks,
      average_marks: (((parseFloat(obtainedMarks)) / (parseFloat(totalMarks))) * 100)
    };

    axios.post('http://127.0.0.1:8000/staff/submit_weekly_test/', testReport, {
      headers: {
        'Authorization': 'Token ' + token
      }
    })
      .then(response => {
        alert('Test report submitted successfully!');
        setTestDate('');
        setObtainedMarks('');
        setTotalMarks('');
        fetchReports(selectedStudent.id);
      })
      .catch(error => console.error(error));
  };

  const handleSubmitMockInterview = () => {
    const mockInterview = {
      student: selectedStudent.id,
      interview_date: interviewDate,
      obtained_score: obtainedScore,
      total_score: totalScore,
      average_score: (((parseFloat(obtainedScore)) / (parseFloat(totalScore))) * 100)
    };
    console.log('mock',mockInterview);
    axios.post('http://127.0.0.1:8000/staff/submit_mock_interview/', mockInterview, {
      headers: {
        'Authorization': 'Token ' + token
      }
    })
      .then(response => {
        alert('Mock interview submitted successfully!');
        setInterviewDate('');
        setObtainedScore('');
        setTotalScore('');
        fetchReports(selectedStudent.id);
      })
      .catch(error => console.error(error));
  };

  const handleUpdateTestReport = (reportId) => {
    const testReport = {
      test_date: testDate || editingTestReport.test_date,
      obtained_marks: obtainedMarks || editingTestReport.obtained_marks,
      total_marks: totalMarks || editingTestReport.total_marks,
      average_marks: (((parseFloat(obtainedMarks)) || parseFloat(editingTestReport.obtained_marks) / (parseFloat(totalMarks)) || parseFloat(editingTestReport.total_marks)) * 100)
    };

    axios.put(`http://127.0.0.1:8000/staff/update_weekly_test/${reportId}/`, testReport, {
      headers: {
        'Authorization': 'Token ' + token
      }
    })
      .then(response => {
        alert('Test report updated successfully!');
        fetchReports(selectedStudent.id);
        setEditingTestReport(null);
      })
      .catch(error => console.error(error));
  };

  const handleUpdateMockInterview = (reportId) => {
    const mockInterview = {
      interview_date: interviewDate || editingMockReport.interview_date,
      obtained_score: obtainedScore || editingMockReport.obtained_score,
      total_score: totalScore || editingMockReport.total_score,
      average_score: (((parseFloat(obtainedScore)) || parseFloat(editingMockReport.obtained_score) / (parseFloat(totalScore)) || parseFloat(editingMockReport.total_score)) )* 100
    };

    axios.put(`http://127.0.0.1:8000/staff/update_mock_interview/${reportId}/`, mockInterview, {
      headers: {
        'Authorization': 'Token ' + token
      }
    })
      .then(response => {
        alert('Mock interview updated successfully!');
        fetchReports(selectedStudent.id);
        setEditingMockReport(null);
      })
      .catch(error => console.error(error));
  };

  

  return (
    <>
      <div><BackButton /></div>
      <div className='mainforsearchandsubmit'>
        <div className='selectsearchdiv'>
          <select onChange={e => setSearchType(e.target.value)} value={searchType}>
            <option value="studentFullName">Search by Name</option>
            <option value="id">Search by ID</option>
            <option value="contact_num">Search by Contact Number</option>
            <option value="email">Search by Email</option>
          </select>
          <input type="text" onChange={e => setSearchQuery(e.target.value)} value={searchQuery} placeholder="Enter search query" />
          <button className="searchbtn" onClick={handleSearch}>Search</button>
          <select onChange={e => handleCourseChange(e.target.value)} value={selectedCourse}>
            <option value="">Select Course</option>
            {courses.map(course => (
              <option key={course.id} value={course.id}>{course.courseName}</option>
            ))}
          </select>
          <select onChange={e => handleBatchChange(e.target.value)} value={selectedBatch}>
            <option value="">Select Batch</option>
            {batches.map(batch => (
              <option key={batch.id} value={batch.id}>{batch.Batch_name}</option>
            ))}
          </select>
        </div>
        <div className='mainforStudentList'>
          <div className='studentdatadiv'>
            <div className='eachstudent'>
              <table className='student_details_for_submit_reports'>
                <caption>Students <span className='table_row_count'>Total Rows : {totalStudents}</span></caption>
                  <thead>
                     <tr>
                        <th>Name</th>
                        <th>ID </th>
                        <th>Email ID</th>
                        <th>Contact Number</th>
                        <th>Course Name</th>
                        <th>Batch Name</th>
                        <th>TEST & PERFORMANCE DETAILS</th>
                      </tr>
                  </thead> 
                
                
                  <tbody>
                    {filteredStudents.map(student => (
                      <tr key={student.id} >
                        <td>{student.studentFullName}</td>
                        <td> {student.id}</td>
                        <td>{student.email}</td>
                        <td>{student.contact_num}</td>
                        <td>{getCourseName(student.course_details)}</td>
                        <td>{getBatchName(student.batch_details)}</td>
                        <td><button onClick={() => handleStudentSelect(student)}  className='get_btn_inside_table'>GET DATA</button></td>
                      </tr>
                    ))}
                  </tbody>
              </table>
              
                
                
            </div>
          </div>
         
        </div>
        {selectedStudent && (
          <div>
            <h2>Selected Student: {selectedStudent.name}</h2>
          <div className='report'>
            <div className='weeklytest'>
              <div className='enrollment_form_for_new_students'>
              <h3>Submit Weekly Test Report</h3>
                <div className='enroll_form_input_divs'>
                  <input type="date" value={testDate} className='enroll_form_input_fields' onChange={e => setTestDate(e.target.value)} />
                  <label className='enroll_form_labels' >Test Date</label>
                </div>
                <div className='enroll_form_input_divs'>
                  <input type="number" value={obtainedMarks} className='enroll_form_input_fields' onChange={e => setObtainedMarks(e.target.value)}  />
                  <label className='enroll_form_labels' >Obtained Marks</label>
                </div>
                <div className='enroll_form_input_divs'>
                  <input type="number" value={totalMarks} className='enroll_form_input_fields' onChange={e => setTotalMarks(e.target.value)}  />
                  <label className='enroll_form_labels' >Total Marks</label>
                </div>
              
                <button className='submitting_btn' onClick={handleSubmitTestReport}>Submit Test Report</button>
              </div>
              
                <h3>Weekly Test Reports</h3>
                {testReports.length > 0 && (
                <table className='student_reports_table_view'>
                  <thead>
                      <tr>
                        <th>Test Date</th>
                        <th>Obtained Marks </th>
                        <th>Total Marks</th>
                        <th></th>
                      </tr>
                  </thead>
                  <tbody>
                    {testReports.map(report => (
                      
                        <tr key={report.id}>
                          <td>{report.test_date}</td>
                          <td>{report.obtained_marks}</td>
                          <td>{report.total_marks}</td>
                          <td><button onClick={() => {
                          setEditingTestReport(report);
                          setTestDate(report.test_date);
                          setObtainedMarks(report.obtained_marks);
                          setTotalMarks(report.total_marks);
                          setIsTestReportPopupOpen(true);
                        }}  className='update_btn_inside_table'>Update Test Report</button></td>
                        </tr>
                        
                        
                     
                    ))}
                
                 </tbody>
                
                </table>
              )}
            </div>
            <div className='mockinterview enrollment_form_for_new_students'>
            <div className='enrollment_form_for_new_students'>
              <h3>Submit Mock Interview Report</h3>
              <div className='enroll_form_input_divs'>
                  <input type="date" value={interviewDate} className='enroll_form_input_fields' onChange={e => setInterviewDate(e.target.value)} />
                  <label className='enroll_form_labels' >Interview Date</label>
                </div>
                <div className='enroll_form_input_divs'>
                  <input type="number" defaultValue={obtainedScore} className='enroll_form_input_fields' onChange={e => setObtainedScore(e.target.value)} />
                  <label className='enroll_form_labels' >Obtained Marks</label>
                </div>
                <div className='enroll_form_input_divs'>
                  <input type="number" defaultValue={totalScore} className='enroll_form_input_fields' onChange={e => setTotalScore(e.target.value)} />
                  <label className='enroll_form_labels' >Total Marks</label>
                </div>
                <button  className='submitting_btn' onClick={handleSubmitMockInterview}>Submit Mock Interview</button>
              </div>
              
              {mockReports.length > 0 && (
                <table className='student_reports_table_view'>
                <thead>
                  <caption>MockInterviewReports</caption>
                    <tr>
                      <th>Interview Date</th>
                      <th>Obtained Score </th>
                      <th>Total Score</th>
                      <th></th>
                    </tr>
                </thead>
                <tbody>
                  {mockReports.map(report => (
                    
                      <tr key={report.id}>
                        <td>{report.interview_date}</td>
                        <td>{report.obtained_score}</td>
                        <td>{report.total_score}</td>
                        <td><button onClick={() => {
                        setEditingMockReport(report);
                        setInterviewDate(report.interview_date);
                        setObtainedScore(report.obtained_score);
                        setTotalScore(report.total_score);
                        setIsMockReportPopupOpen(true);
                      }}  className='update_btn_inside_table'>Update Mock Interview</button></td>
                      </tr>
                      
                      
                   
                  ))}
              
               </tbody>
              
              </table>
                
              )}
            </div>
          </div>
          </div>
        )}
        
        {isTestReportPopupOpen && (
          <div className="popup">
            <h3>Update Weekly Test Report</h3>
            Test Date:<input type="date" className='enroll_form_input_fields' value={testDate} onChange={e => setTestDate(e.target.value)} />
            Obtained Marks:<input type="number" className='enroll_form_input_fields'  value={obtainedMarks} onChange={e => setObtainedMarks(e.target.value)} placeholder="Obtained Marks" />
            Total Marks: <input type="number" className='enroll_form_input_fields' value={totalMarks} onChange={e => setTotalMarks(e.target.value)} placeholder="Total Marks" />
            <button  className='submitting_btn' onClick={() => handleUpdateTestReport(editingTestReport.id)}>Update Test Report</button>
            <button className='close_btn' onClick={() => {
              setIsTestReportPopupOpen(false);
              setEditingTestReport(null);
            }}>Close</button>
          </div>
        )}
        {isMockReportPopupOpen && (
          <div className="popup">
            <h3>Update Mock Interview</h3>
            Interview Date:<input type="date" className='enroll_form_input_fields' value={interviewDate} onChange={e => setInterviewDate(e.target.value)} />
            Obtained Score: <input type="number" className='enroll_form_input_fields' value={obtainedScore} onChange={e => setObtainedScore(e.target.value)} placeholder="Obtained Score" />
            Total Score:<input type="number" className='enroll_form_input_fields' value={totalScore} onChange={e => setTotalScore(e.target.value)} placeholder="Total Score" />
            <button  className='submitting_btn' onClick={() => handleUpdateMockInterview(editingMockReport.id)}>Update Mock Interview</button>
            <button className='close_btn' onClick={() => {
              setIsMockReportPopupOpen(false);
              setEditingMockReport(null);
            }}>Close</button>
          </div>
        )}
      </div>
    </>
  );
};

export default SearchAndSubmitTest;






/*
import React, { useState } from 'react';
import axios from 'axios';
import './SearchAndSubmit.css';

const SearchAndSubmitTest = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('name');  // Add state for search type
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [testDate, setTestDate] = useState('');
  const [obtainedMarks, setObtainedMarks] = useState('');
  const [totalMarks, setTotalMarks] = useState('');

  const handleSearch = () => {
    axios.get(`http://127.0.0.1:8000/staff/search_students/?query=${searchQuery}&type=${searchType}`)
      .then(response => {
        setStudents(response.data);
      })
      .catch(error => console.error(error));
  };

  const handleSubmit = () => {
    const testReport = {
      student: selectedStudent.id,
      test_date: testDate,
      obtained_marks: obtainedMarks,
      total_marks: totalMarks
    };

    axios.post('http://127.0.0.1:8000/staff/submit_weekly_test/', testReport)
      .then(response => {
        alert('Test report submitted successfully!');
        setTestDate('');
        setObtainedMarks('');
        setTotalMarks('');
      })
      .catch(error => console.error(error));
  };

  return (
    <div className='mainforsearchandsubmit'>
      <div className='selectsearchdiv'>
        <select onChange={e => setSearchType(e.target.value)} value={searchType}>
          <option value="name">Search by Name</option>
          <option value="id">Search by ID</option>
          <option value="contact_num">Search by Contact Number</option>
          <option value="email">Search by Email</option>
        </select>
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder={`Search student by ${searchType}`}
        />
        <button onClick={handleSearch}>Search</button>
      </div>
        <ul>
            <li>ID &nbsp;&nbsp;&nbsp;Name:</li>
        </ul>
      <ul>
        {students.map(student => (
          <li key={student.id} onClick={() => setSelectedStudent(student)}>
            {student.id}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{student.studentFullName}
          </li>
        ))}
      </ul>

      {selectedStudent && (
        <div className='reportsubmitdiv'>
          <h3>Selected Student: {selectedStudent.studentFullName}</h3>
          <div className='enterdetailsdiv'>
          <input
            type="date"
            value={testDate}
            onChange={e => setTestDate(e.target.value)}
          />
          <input
            type="number"
            value={obtainedMarks}
            onChange={e => setObtainedMarks(e.target.value)}
            placeholder="Obtained Marks"
          />
          <input
            type="number"
            value={totalMarks}
            onChange={e => setTotalMarks(e.target.value)}
            placeholder="Total Marks"
          />
          <button onClick={handleSubmit}>Submit Test Report</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchAndSubmitTest;
*/
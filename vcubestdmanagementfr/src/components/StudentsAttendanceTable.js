import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './StudentsAttendance.css';
import BackButton from './BackButtonFunctionality';

const StudentAttendanceTable = () => {
  const [attendances, setAttendances] = useState([]);
  const [students, setStudents] = useState([]);
  const [dates, setDates] = useState([]);
  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState({});

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/staff/allstdsattendance/')
      .then(response => {
        const attendancesData = response.data['att'];
        const stds = response.data['stdObj'];
        const crs = response.data['courses'];
        const bts = response.data['batches'];

        // Extract unique students
        const studentsData = [...new Set(stds.map(s => s.id))].map(id => stds.find(s => s.id === id));

        // Extract unique dates
        const datesData = [...new Set(attendancesData.map(a => a.date))].sort((a, b) => new Date(a) - new Date(b));

        // Create a dictionary of batches grouped by course
        const batchesData = {};
        crs.forEach(course => {
          batchesData[course.courseName] = [...new Set(stds.filter(s => s.course_details === course.id).map(s => s.batch_details))];
        });

        setAttendances(attendancesData);
        setStudents(studentsData);
        setDates(datesData);
        setCourses(crs);
        setBatches(batchesData);
      })
      .catch(error => console.error(error));
  }, []);

  const getStudentStatus = (studentId, date) => {
    const attendance = attendances.find(a => a.student === studentId && a.date === date);
    return attendance ? attendance.status : 'ABSENT';
  };
  console.log(dates);
  console.log(courses);
  console.log(batches);

  return (
    <>
    <div className='stdsattendancetablediv'>
      <div><BackButton /></div>
      <div className='std_attendance_responsive_div'>
        <table className='attendance_table_for_staff'>
        <thead>
          <tr>
            <th className='table_head_att'>Student Name</th>
            <th className='table_head_att'>Course</th>
            <th className='table_head_att'>Batch</th>
            {dates.map(date => (
              <th key={date} className='table_head_att'>{new Date(date).toLocaleDateString()}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {courses.map(course => (
            <React.Fragment key={course.id}>
              {batches[course.courseName]?.map(batch => (
                <React.Fragment key={batch}>
                  {students.filter(s => s.course_details === course.id && s.batch_details === batch).map(student => (
                    <tr key={student.id}>
                      <td className='table_data_att'>{student.studentFullName}</td>
                      <td className='table_data_att'>{course.courseName}</td>
                      <td className='table_data_att'>{batch}</td>
                      {dates.map(date => (
                        <td key={date} className='table_data_att'>{getStudentStatus(student.id, date)}</td>
                      ))}
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
      </div>
    </div>
    </>
  );
};

export default StudentAttendanceTable;


/*
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StudentAttendanceTable = () => {
  const [attendances, setAttendances] = useState([]);
  const [students, setStudents] = useState([]);
  const [stdObjs,setStdObjs] = useState([]);
  const [courseobjs,setCourseobjs] = useState([]);
  const [batchobjs,setBatchobjs] = useState([]);
  const [dates, setDates] = useState([]);
  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState({});

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/staff/allstdsattendance/')
      .then(response => {
        const attendancesData = response.data['att'];
        //console.log(response.data);
        //console.log(attendancesData);
        const studentsData = [...new Set(attendancesData.map(a => a.student))];
        console.log('Students DATA',studentsData);
        const datesData = [...new Set(attendancesData.map(a => a.date))].sort((a, b) => {
          return new Date(a) - new Date(b);
        });
        //console.log('DATES DATA',datesData);
        const stds = (response.data['stdObj'])
        console.log('sTDOBHS',stds);
        //const coursesData = [...new Set(stds.map(s => s.course_details))];
        //console.log('courseDATA',coursesData);
        const crs = (response.data['courses'])
        console.log('Course details',crs);
        const bts = (response.data['batches']);
        const batchesData = {};

        crs.forEach(course => {
          batchesData[course] = [...new Set(stds.filter(s => s.course_details === course).map(s => s.batch_details))];
        });
        console.log('Batch dict',batchesData);
        console.log(bts);
        setAttendances(attendancesData);
        setStudents(studentsData);
        setDates(datesData);
        setCourses(coursesData);
        setBatches(batchesData);
        setBatchobjs(bts);
        setCourseobjs(crs);
        setStdObjs(stds);
        console.log('attendances',attendances);
        console.log('stds',students);
        console.log('dates',dates);
        console.log('sTd Objs',stdObjs);
        console.log('Cpourse Objs',courseobjs);
        console.log('Batch Objs:',batchobjs);
        console.log('Courses:',courses);
        console.log('Batches:',batches);
      })
      .catch(error => console.error(error));
  }, []);

  const getStudentStatus = (student, date) => {
    const attendance = attendances.find(a => a.student === student && a.date === date);
    return attendance ? attendance.status : '';
  };

  return (
    <table>
      <thead>
        <tr>
          <th>Course</th>
          <th>Batch</th>
          <th>Student</th>
          {dates.map(date => (
            <th key={date}>{date}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {courses.map(course => (
          <React.Fragment key={course}>
            {batches[course].map(batch => (
              <React.Fragment key={batch}>
                {students.filter(s => s.course_details === course && s.batch_details === batch).map(student => (
                  <tr key={student}>
                    <td>{course}</td>
                    <td>{batch}</td>
                    <td>{student.studentFullName}</td>
                    {dates.map(date => (
                      <td key={date}>{getStudentStatus(student, date)}</td>
                    ))}
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </React.Fragment>
        ))}
      </tbody>
    </table>
  );
};

export default StudentAttendanceTable;

*/











/*import React, { useState, useEffect } from 'eact';
import axios from 'axios';

const StudentAttendanceTable = () => {
  const [attendances, setAttendances] = useState([]);
  const [students, setStudents] = useState([]);
  const [dates, setDates] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/attendances/')
     .then(response => {
        const attendancesData = response.data;
        const studentsData = [...new Set(attendancesData.map(a => a.student))];
        const datesData = [...new Set(attendancesData.map(a => a.date))].sort((a, b) => {
          return new Date(a) - new Date(b);
        });

        setAttendances(attendancesData);
        setStudents(studentsData);
        setDates(datesData);
      })
     .catch(error => console.error(error));
  }, []);

  const getStudentStatus = (student, date) => {
    const attendance = attendances.find(a => a.student === student && a.date === date);
    return attendance? attendance.status : '';
  };

  return (
    <table>
      <thead>
        <tr>
          <th>Student</th>
          {dates.map(date => (
            <th key={date}>{date}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {students.map(student => (
          <tr key={student}>
            <td>{student}</td>
            {dates.map(date => (
              <td key={date}>{getStudentStatus(student, date)}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default StudentAttendanceTable;
*/
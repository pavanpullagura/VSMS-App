import { useNavigate } from "react-router-dom";
import { useContext, useState, useEffect, useRef } from "react";
import { userCont } from "./App";
import axios from "axios";
import './Attendance.css';
import BackButton from "./components/BackButtonFunctionality";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import DownloadSharpIcon from '@mui/icons-material/DownloadSharp';
import DownloadDoneSharpIcon from '@mui/icons-material/DownloadDoneSharp';

function StudentSelfAttendance() {
    let [[user, setUser], [token, setToken], [isAuthenticated, setIsAuthenticated], [userType, setUserType]] = useContext(userCont);
    let [attendanceData, setAttendanceData] = useState([]);
    let [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    let [isDownloaded, setIsDownloaded] = useState(false);
    let navigate = useNavigate();
    const tableRef = useRef(null);

    if (isAuthenticated[0] === false) {
        console.log('inside if');
        navigate('/login');
    }

    useEffect(() => {
        let fetchAttendance = () => axios.get('http://127.0.0.1:8000/student/monthlyattendance/' + user + '/', {
            headers: {
                "Authorization": 'token ' + token
            }
        }).then((resp) => {
            console.log(resp);
            setAttendanceData(resp.data);
        }
        ).catch((error) => {
            console.log('error raised');
            console.log(error);
        });
        fetchAttendance();
    }, [token, user]);

    const filterByMonth = (data, month) => {
        return data.filter(item => new Date(item.date).getMonth() + 1 === month);
    };

    const handleMonthChange = (event) => {
        setSelectedMonth(parseInt(event.target.value));
    };

    const renderAttendance = (data) => {
        return data.map((item, index) => (
            <tr key={index}>
                <td>{item.date}</td>
                <td>{item.status}</td>
            </tr>
        ));
    };

    const handleDownloadPDF = () => {
        const input = tableRef.current;

        html2canvas(input)
            .then((canvas) => {
                const pdf = new jsPDF('p', 'mm', 'a4');
                pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 210, 297);
                pdf.save(`attendance_${new Date().getFullYear()}_${selectedMonth}`.pdf);
                setIsDownloaded(true);
                setTimeout(() => {
                    setIsDownloaded(false);
                }, 2000); // Reset icon after 2 seconds
            });
    };

    return (
        <>
            <div><BackButton /></div>
            <div className="stdAttendance">
                <h1>Student Attendance Details</h1>
                <label>
                    Select Month:
                    <select value={selectedMonth} onChange={handleMonthChange}>
                        {Array.from({ length: 12 }, (_, i) => (
                            <option key={i + 1} value={i + 1}>
                                {new Date(0, i).toLocaleString('default', { month: 'long' })}
                            </option>
                        ))}
                    </select>
                </label>
                <button onClick={handleDownloadPDF} className="download_button">
                    {isDownloaded ? <DownloadDoneSharpIcon /> : <DownloadSharpIcon />} 
                    {isDownloaded ? 'Downloaded' : 'Download PDF'}
                </button>

                <div ref={tableRef} className="std_self_attendance_table_div">
                    <table className="stdSelfAttendanceTable">
                        <thead className="attendance_details_table_header">
                            <tr>
                                <th>Date</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {renderAttendance(filterByMonth(attendanceData, selectedMonth))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default StudentSelfAttendance;
import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { userCont, courseContext } from '../.././App';
import { useNavigate, Link } from 'react-router-dom';
import { Layout, Menu, Statistic, Row, Col, Card, Table, Button, Modal, Breadcrumb } from 'antd';
import { Line, Bar } from 'react-chartjs-2';
import { UserOutlined, PieChartOutlined, TeamOutlined, FileTextOutlined } from '@ant-design/icons';
import './StaffNewDashboard.css';
import BackButton from '.././BackButtonFunctionality';

const { Header, Content, Footer, Sider } = Layout;

const StaffNewDashboard = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [allStudentsDetails, setAllStudentsDetails] = useState([0]);
    const [students, setStudents] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [attendanceData, setAttendanceData] = useState({ labels: [], datasets: [] });
    const [testReportData, setTestReportData] = useState({ labels: [], datasets: [] });
    const [mockInterviewData, setMockInterviewData] = useState({ labels: [], datasets: [] });
    let [[user,setUser],[token, setToken],[isAuthenticated, setIsAuthenticated],[userType, setUserType]] = useContext(userCont);
    const [courses, setCourses] = useState([]);
    const [batches, setBatches] = useState([]);
    const [selectedStudentPerformance, setSelectedStudentPerformance] = useState({
        attendance: { labels: [], datasets: [] },
        weeklyTests: { labels: [], datasets: [] },
        mockInterviews: { labels: [], datasets: [] }
    });
    console.log(selectedStudentPerformance);
    const navigate = useNavigate();

    


    const showModal = (studentId) => {
        setIsModalVisible(true);

        // Fetch selected student's performance data
        axios.get(`http://127.0.0.1:8000/staff/eachstdperformance/${studentId}`, {
            headers: {
              'Authorization': 'Token ' + token
            }
          })
            .then(response => {
                console.log(response);
                console.log('ATtendance',response.data['attendance']);
                console.log('weekly_tests',response.data['weekly_tests']);
                console.log('mock_interviews',response.data['mock_interviews']);
                const  attendance  = response.data['attendance'];
                const  weeklyTests = response.data['weekly_tests'];
                const  mockInterviews = response.data['mock_interviews'];
                setSelectedStudentPerformance({
                    attendance: {
                        labels: attendance.map(item => item.date),
                        datasets: [{
                            label: 'Attendance',
                            data: attendance.map(item => item.status === 'PRESENT' ? 1 : 0),
                            backgroundColor: 'rgba(75,192,192,0.4)',
                            borderColor: 'rgba(75,192,192,1)',
                            borderWidth: 1
                        }]
                    },
                    weeklyTests: {
                        labels: weeklyTests.map(item => item.test_date),
                        datasets: [{
                            label: 'Weekly Test Scores',
                            data: weeklyTests.map(item => item.obtained_marks),
                            backgroundColor: 'rgba(153,102,255,0.4)',
                            borderColor: 'rgba(153,102,255,1)',
                            borderWidth: 1
                        },
                        {
                            label: 'Total Marks',
                            data: weeklyTests.map(item => item.total_marks),
                            backgroundColor: 'rgba(153, 102, 255, 1)',
                            },]
                    },
                    mockInterviews: {
                        labels: mockInterviews.map(item => item.interview_date),
                        datasets: [{
                            label: 'Mock Interview Scores',
                            data: mockInterviews.map(item => item.obtained_score),
                            backgroundColor: 'rgba(255,159,64,0.4)',
                            borderColor: 'rgba(255,159,64,1)',
                            borderWidth: 1
                        }]
                    }
                });
            })
            .catch(error => console.error(error));
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };
/*
    useEffect(() => {
            const displayCourses = async () => {
                try {
                let response = await axios.get(
                    'http://127.0.0.1:8000/staff/allcourses/',
                    {
                    headers: {
                        "Authorization": 'Token ' + token,
                    },
                    }
                );
                if (response.status === 200) {
                    setCourses(response.data);
                } else {
                    console.error('Fetching courses failed with status:', response.status);
                }
                } catch (error) {
                console.error('There was an error fetching data!', error);
                }
            };
            displayCourses();
    },[token]);
    
*/
    const fetchData = async () => {
        try {
        const [attendanceRes, testRes, mockRes] = await Promise.all([
            
            axios.get('http://127.0.0.1:8000/staff/allstdsattendance/', {
            headers: {
                "Authorization": 'Token ' + token,
            },
            }),
            axios.get('http://127.0.0.1:8000/staff/studenttests/', {
            headers: {
                "Authorization": 'Token ' + token,
            },
            }),
            axios.get('http://127.0.0.1:8000/staff/studentmockinterviews/', {
            headers: {
                "Authorization": 'Token ' + token,
            },
            }),
        ]);

        if (attendanceRes.status === 200) {
            console.log(attendanceRes.data['att']);
            setAttendanceData(processAttendanceData(attendanceRes.data['att']));
            console.log(attendanceRes.data);
        }
        if (testRes.status === 200) {
            setTestReportData(processTestReportData(testRes.data));
            console.log(testRes.data);
        }
        if (mockRes.status === 200) {
            setMockInterviewData(processMockInterviewData(mockRes.data));
            console.log(mockRes.data);
        }
        } catch (error) {
        console.error('There was an error fetching data!', error);
        }
    };

    const processAttendanceData = (data) => {
        if (!data) return { labels: [], datasets: [] };

        const labels = [...new Set(data.map(d => d.date.slice(0, 7)))];
        const attendance = labels.map(label => {
        const monthlyData = data.filter(d => d.date.slice(0, 7) === label);
        const presentCount = monthlyData.filter(d => d.status === 'PRESENT').length;
        return presentCount / monthlyData.length * 100;
        });
        return {
        labels,
        datasets: [{
            label: 'Average Monthly Attendance (%)',
            data: attendance,
            borderColor: 'rgba(75, 192, 192, 1)',
            fill: false,
        }],
        };
    };

    const processTestReportData = (data) => {
        if (!data) return { labels: [], datasets: [] };

        const labels = data.map(d => d.test_date);
        const obtainedMarks = data.map(d => d.obtained_marks);
        const totalMarks = data.map(d => d.total_marks);

        return {
        labels,
        datasets: [
            {
            label: 'Obtained Marks',
            data: obtainedMarks,
            backgroundColor: 'rgba(75, 192, 192, 1)',
            },
            {
            label: 'Total Marks',
            data: totalMarks,
            backgroundColor: 'rgba(153, 102, 255, 1)',
            },
        ],
        };
    };

    const processMockInterviewData = (data) => {
        if (!data) return { labels: [], datasets: [] };

        const labels = data.map(d => d.interview_date);
        const scores = data.map(d => d.obtained_score);

        return {
        labels,
        datasets: [{
            label: 'Mock Interview Scores',
            data: scores,
            borderColor: 'rgba(255, 99, 132, 1)',
            fill: false,
        }],
        };
    };

    useEffect(() => {
        fetchData();
    }, [token]);

    const toggleCollapsed = () => setCollapsed(!collapsed);
    //const showModal = () => setIsModalVisible(true);
    const handleOk = () => setIsModalVisible(false);
    //const handleCancel = () => setIsModalVisible(false);

    useEffect(() => {
        console.log('fetch students is called');
        

    const fetchStudents = (page, pageSize) => {
        axios.get(`http://127.0.0.1:8000/staff/getallstudents/?page=${page}&page_size=${pageSize}`, {
            headers: {
                "Authorization": 'Token ' + token,
            },
            }).then(resp => {
                setAllStudentsDetails(resp.data.results.stdData);
                console.log(resp,resp.data.results);
                setCourses(resp.data.results.crs);
                setBatches(resp.data.results.bts);
                setTotalItems(resp.data.count); // Assuming the total count of items is returned by the API
            }).catch(error => console.error('Error fetching students:', error));
    };
    fetchStudents(currentPage, pageSize);
    }, [currentPage, pageSize]);

    useEffect(() => {
        console.log('fetch total students is called');
        

    const fetchTotalStudents = () => {
        axios.get(`http://127.0.0.1:8000/staff/allstudents/`, {
            headers: {
                "Authorization": 'Token ' + token,
            },
            }).then(resp => {
                setStudents(resp.data.stdData);
                console.log(resp,resp.data);// Assuming the total count of items is returned by the API
            }).catch(error => console.error('Error fetching students:', error));
    };
    fetchTotalStudents();
    }, []);

    const handleTableChange = (pagination) => {
        setCurrentPage(pagination.current);
        setPageSize(pagination.pageSize);
    };
    const columns = [
        { title: 'Name', dataIndex: 'studentFullName', key: 'name' },
        { title: 'Course', dataIndex: 'course_details', key: 'course' },
        { title: 'Batch', dataIndex: 'batch_details', key: 'batch' },
        { title: 'Action',
            key: 'action',
            render: (text, record) => (
                <Button type="primary" onClick={() => showModal(record.id)}>
                    View Details
                </Button>
            )
        }
    ];

    const statistics = [
        { title: 'Total Students in institute', value: students.length },
        { title: 'Total Courses', value: courses.length },
        // Add more statistics as needed
    ];
  return (
    <Layout style={{ minHeight: '100vh' }}>
        
        <div><BackButton /></div>
        {/*<Sider collapsible collapsed={collapsed} onCollapse={toggleCollapsed}>
        <div className="logo" />
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
            <Menu.Item key="1" icon={<PieChartOutlined />}>
            Dashboard
            </Menu.Item>
            <Menu.Item key="2" icon={<UserOutlined />}>
            Attendance
            </Menu.Item>
            <Menu.Item key="3" icon={<TeamOutlined />}>
            Students
            </Menu.Item>
            <Menu.Item key="4" icon={<FileTextOutlined />}>
            Reports
            </Menu.Item>
        </Menu>
        </Sider>*/}
        <Layout className="site-layout">
        <Header className="site-layout-background" style={{ padding: 0 }} />
        <Content style={{ margin: '0 16px' }}>
            {/*<Breadcrumb style={{ margin: '16px 0' }}>
                <Breadcrumb.Item>{user}</Breadcrumb.Item>
                <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
            </Breadcrumb>*/}
            <div className="site-dashboard-content" style={{ padding: 24, minHeight: 360 }}>
            <Row gutter={16}>
                {statistics.map(stat => (
                <Col span={8} key={stat.title}>
                    <Card>
                    <Statistic title={stat.title} value={stat.value} />
                    </Card>
                </Col>
                ))}
            </Row>
            
            <Row gutter={[16, 16]}>
                <Col span={24}>
                    <Card title="All Students">
                        <Table
                            dataSource={allStudentsDetails}
                            columns={columns}
                            rowKey="id"
                            pagination={{
                                current: currentPage,
                                pageSize: pageSize,
                                total: totalItems,
                                showSizeChanger: true,
                                pageSizeOptions: ['10', '20', '50', '100'],
                            }}
                            onChange={handleTableChange}
                        />
                    </Card>
                </Col>
            </Row>
            <Row gutter={16} style={{ marginTop: 32 }}>
                <Col span={24}>
                    <Card title="Average Monthly Attendance">
                        <Line data={attendanceData} />
                    </Card>
                </Col>
            </Row>
            <Row gutter={16} style={{ marginTop: 32 }}>
                <Col span={24}>
                    <Card title="Weekly Test Reports">
                        <Bar data={testReportData} />
                    </Card>
                </Col>
            </Row>
            <Row gutter={16} style={{ marginTop: 32 }}>
                <Col span={24}>
                    <Card title="Mock Interview Performance">
                        <Line data={mockInterviewData} />
                    </Card>
                </Col>
            </Row>
            </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>Vcube Student Management System ©2024 Created by Pavan Kumar</Footer>
        </Layout>

        <Modal title="Student Performance Details" visible={isModalVisible} onCancel={handleCancel} footer={null}>
            <h3>Attendance</h3>
            <Line data={selectedStudentPerformance.attendance} />
            <h3>Weekly Test Performance</h3>
            <Bar data={selectedStudentPerformance.weeklyTests} />
            <h3>Mock Interview Performance</h3>
            <Bar data={selectedStudentPerformance.mockInterviews} />
        </Modal>
    </Layout>
    );
};
export default StaffNewDashboard;

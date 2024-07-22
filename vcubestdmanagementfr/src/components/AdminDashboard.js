
import { userCont } from '../App';
import { Link } from 'react-router-dom';
import './AdminDashboard.css';
import { useContext } from 'react';

function AdminDashbord(){
    let [[user,setUser],[token, setToken],[isAuthenticated, setIsAuthenticated],[userType, setUserType]] = useContext(userCont);

    return(
        <>
        
            <div className="admin_dashboard_maindiv">
                
                <div className='admin_dashboard_tabs'>
                <div className='admin_dashboard_subtabs'><h3><Link to='/registeradmin'>Add admin</Link></h3></div>
                    <div className="admin_dashbord_subtabs">
                        <p><Link to='/staffdetails'>Staff Details</Link></p>
                    </div>
                    <div className="admin_dashbord_subtabs">
                        <p><Link to='/alldepartments'>All Departments</Link></p>
                    </div>
                    <div className="admin_dashbord_subtabs">
                        <p><Link to='/registerstaff'>Add New Staff</Link></p>
                    </div>
                    <div className="admin_dashbord_subtabs">
                        <p><Link to='/adddepartment'>Add New Department</Link></p>{/*inside the departments component add 
                        new link as overlay component(pop up) for display a form to add new department*/}
                    </div>
                    <div className="admin_dashbord_subtabs">
                        <p><Link to='/addcourse'>Add New Course</Link></p>
                        
                    </div>
                </div>
            </div>
        </>
    );
}

export default AdminDashbord;
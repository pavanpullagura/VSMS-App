import { useRef, useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../images/cropped-cropped-logo-c-removebg-preview.png";
import './AdminSidebar.css';
import { userCont } from "../App";
import axios from "axios";
import { Home, People, Book, Group, Person, ExitToApp, ExpandMore, ExpandLess } from '@mui/icons-material';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import LanIcon from '@mui/icons-material/Lan';

const navItems = [
    { name: "home", icon: <Home />, path: "/admin" },
    { 
        name: "staff", 
        path: "/staffdetailsintabs",
        icon: <LanIcon/>,
        dropdown: [
            { name: "All Staff", icon: <PersonAddAlt1Icon/>, path: "/staffdetails" },
            { name: "Add Staff", icon: <People />,  path: "/registerstaff" }
        ]
    },
    { name: "courses", icon: <Book />, path: "/admincourseview" },
    { name: "students", icon: <Group />, path: "/studentslist" },
    { name: "profile", icon: <Person />, path: "/adminprofile" },
    { name: "logout", icon: <ExitToApp />, path: "" }
];

const AdminSidebar = () => {
    const [width, setWidth] = useState(200);
    const [dropdownOpen, setDropdownOpen] = useState({});
    const sidebarRef = useRef(null);
    const [[user, setUser], [token, setToken], [isAuthenticated, setIsAuthenticated], [userType, setUserType]] = useContext(userCont);
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [objid, setObjid] = useState(0);
    const navigate = useNavigate();

    const [isProfileVisible, setIsProfileVisible] = useState(false);

    const handleToggleProfileVisibility = () => {
        setIsProfileVisible(!isProfileVisible);
    };

    const resize = (e) => {
        const sidebar = sidebarRef.current;
        if (!sidebar) return;
        let newWidth = e.clientX - sidebar.offsetLeft;
        if (newWidth < 61) newWidth = 60;
        if (newWidth > 259) newWidth = 260;
        setWidth(newWidth);
    };

    const stopResize = () => {
        window.removeEventListener("mousemove", resize);
        window.removeEventListener("mouseup", stopResize);
    };

    const initResize = () => {
        window.addEventListener("mousemove", resize);
        window.addEventListener("mouseup", stopResize);
    };

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (token) {
                try {
                    const response = await axios.get(`http://127.0.0.1:8000/${userType}/profile/${user}/`, {
                        headers: {
                            'Authorization': 'Token ' + token
                        }
                    });
                    setUserProfile(response.data.profileObj[0]);
                    setObjid(parseInt(response.data.profileObj[0]['id']));
                    setLoading(false);
                } catch (err) {
                    setError(err);
                    setLoading(false);
                }
            }
        };

        fetchUserProfile();
    }, [token, user, userType]);

    const handleLogout = () => {
        setToken(null);
        setIsAuthenticated(false);
        setUser(null);
        setUserType(null);
        navigate('/login');
    };

    const toggleDropdown = (itemName) => {
        setDropdownOpen((prev) => ({
            ...prev,
            [itemName]: !prev[itemName]
        }));
    };

    useEffect(() => {
        if (userProfile) {
            setObjid(userProfile['id']);
        }
    }, [userProfile]);

    return (
        <aside ref={sidebarRef} style={{ width: `${width}px` }} className="sidebar">
            <div className="handle" onMouseDown={initResize}></div>
            <div className="sidebar-inner">
                <header className="sidebar-header">
                    <div className="sidebar_user_details_div">
                        <img src={userProfile ? userProfile.image : ''} className="sidebar-logo" height='120px' width='120px' style={{ borderRadius: '50%' }} />
                    </div>
                    <div className="sidebar_user_details_div">
                        <button type="button" className="sidebar-burger">
                            <span className="adminusername">{userProfile ? userProfile['first_name'] + ' ' + userProfile['last_name'] : user}</span>
                        </button>
                    </div>
                </header>
                <nav className="sidebar-menu">
                    {navItems.map((item) => (
                        <div key={item.name} className={`sidebar-item ${dropdownOpen[item.name] ? 'open' : ''}`}>
                            <button 
                                type="button" 
                                className="sidebar-button" 
                                onClick={() => item.dropdown ? toggleDropdown(item.name) : navigate(item.path)}
                            >
                            
                                <span className="material-symbols-outlined">{item.icon}</span>
                                {item.name==='logout'?<p onClick={handleLogout}>{item.name}</p>:<p>{item.name}</p>}
                                {item.dropdown && (dropdownOpen[item.name] ? <ExpandLess /> : <ExpandMore />)}
                            </button>
                            {item.dropdown && (
                                <div className="dropdown-content">
                                    {item.dropdown.map((subItem) => (
                                        <Link key={subItem.name} to={subItem.path}>
                                            <button type="button" className="sidebar-sub-button">{subItem.icon}&nbsp;{subItem.name}</button>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </nav>
            </div>
        </aside>
    );
};

export default AdminSidebar;

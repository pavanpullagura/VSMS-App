import { Link } from "react-router-dom";
import './Loginlinks.css';
import { Home, People, Book, Groups, Person, ExitToApp } from '@mui/icons-material';
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
//import { byPrefixAndName } from '@awesome.me/kit-KIT_CODE/icons';
//<FontAwesomeIcon icon="fa-solid fa-arrow-right" />

function Loginlinks(){
    return(
        <>
        <h1 className="subhead">Login Links</h1>
        <div className="maindiv">
            
            <div className="subdivloginlinks">
                <Link to='/adminlogin' ><span><Person/></span>Admin User Login</Link>
            </div>
            <div className="subdivloginlinks">
                <Link to="/stafflogin" > <span><People /></span>Management Login</Link>
            </div>
            <div className="subdivloginlinks">
                <Link to="/std" > <Groups/>Student Login</Link>
            </div>
        </div>
        </>
    );
}
export default Loginlinks;
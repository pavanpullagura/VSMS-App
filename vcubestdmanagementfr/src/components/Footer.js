import './Footer.css';
import logo from '../images/cropped-cropped-logo-c-removebg-preview.png';
import { Link } from 'react-router-dom';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import YouTubeIcon from '@mui/icons-material/YouTube';
import LinkedInIcon from '@mui/icons-material/LinkedIn';


function Footer(){
    return(
        <>
        <footer class="top">
            <div className='footer_image'>
            <img src={logo} alt="" height='80px' width='200px' />
            <p class="copyright">&copy;2024 VCUBE IT Technologies Pvt. Ltd.</p>
            </div>
            <div class="links">
                <div class="links-column">
                    <h2>Quick Links</h2>
                    <a href="">About us</a>
                    <a href="">Careers</a>
                    <a href="">Team</a>
                </div>
               
                <div class="links-column">
                    <h2>Other Pages</h2>
                    <a href="">Jobs</a>
                    <a href="">Interviews</a>
                </div>
                <div class="links-column">
                    <h2>Contact info</h2>
                    <p> 2nd Floor Above Raymond’s Clothing Store KPHB, Phase-1, Kukatpally, Hyderabad​</p>
                    <p>+91 7675070124, +91 9059456742</p>
                    <p>contact@vcubegroup.com</p>
                </div>
                <div class="socials-column">
                    <h2>Social Media</h2>
                    <p className='socials_follow'>
                        Follow us on.....
                    </p>
                    <div className='social_icons_div'>
                        <div class="socials">
                            <Link to='' className='whatsapp_link'><WhatsAppIcon sx={{ fontSize: 40 }} /></Link>
                            <Link to='https://www.linkedin.com/company/v-cube-software-solutions-pvt-ltd-official/'  className='linkedin_link'><LinkedInIcon sx={{ fontSize: 40 }} /></Link>
                        </div>
                        <div class="socials">
                            <Link to='https://www.instagram.com/vcubesoftwaresolutions/?igshid=ZDc4ODBmNjlmNQ%3D%3D' className='insta_link'><InstagramIcon sx={{ fontSize: 40 }} /></Link>
                            
                            <Link to='https://www.youtube.com/@VCUBESoftwareSolutions' className='youtube_link'><YouTubeIcon sx={{ fontSize: 40 }} /></Link>
                        </div>
                    </div>
                    
                </div>
            </div>
        </footer>
        
        </>
    );
}
export default Footer;
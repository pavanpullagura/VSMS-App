import './Stories.css';
import storyimage from '../images/wp6346154-ram-charan-photos-hd-wallpapers.jpg';

function stories(){
    return(
        <>
        <div className='storydiv'>
        <div className='substorydiv'>
        <div className='ourstorydiv'>
                <h2>Our Story</h2>
                <p>Embark on a journey of knowledge and innovation at VCUBE,<br/>
                the leading software coaching center in Hyderabad.<br/><br/>
                With a legacy of enpowering students, businessmen and <br/>
                freelancers, we offer a range of offline and online IT <br/>
                courses and programming classes.<br/><br/>
                Join us at our state-of-the-art training centers in Kukatpally<br/>
                to elevate your skills and career aspirations.</p>
            </div>
            <div className='storyimagediv'>
                
            </div>
        </div>
        </div>
        <div className='success_outer2_div' >
            <div className='success_outer_div'>
                <div className='success_div_head'>
                    <h2>Success Stories</h2>
                </div>
                <div className='success_stories'>
                    <p>VCUBE transformed my career! The <br/>courses are top-notch, and the support <br/>is exceptional</p>
                    <img src={storyimage} height='50px' width='50px' style={{borderRadius:'50%'}} /><h4>Pavan</h4>
                </div>
                <div className='success_stories'>
                    <p>I never thought learning IT could be <br/>this fun and rewarding. VCUBE<br/>exceeded all my expectations!</p>
                    <img src={storyimage} height='50px' width='50px' style={{borderRadius:'50%'}} /><h4>Ram Charan</h4>
                </div>
                <div className='success_stories'>
                    <p>Thanks to VCUBE, I now have the skills<br/>to thrive in the digital age. Highly<br/>recommended!</p>
                    <img src={storyimage} height='50px' width='50px' style={{borderRadius:'50%'}} /><h4>Ganesh</h4>
                </div>
                <div className='success_stories'>
                    <p>VCUBE transformed my career! The <br/>courses are top-notch, and the support <br/>is exceptional</p>
                    <img src={storyimage} height='50px' width='50px' style={{borderRadius:'50%'}} /><h4>Siva</h4>
                </div>
                <div className='success_stories'>
                    <p>VCUBE transformed my career! The <br/>courses are top-notch, and the support <br/>is exceptional</p>
                    <img src={storyimage} height='50px' width='50px' style={{borderRadius:'50%'}} /><h4>Srinivas</h4>
                </div>
                <div className='success_stories'>
                    <p>VCUBE transformed my career! The <br/>courses are top-notch, and the support <br/>is exceptional</p>
                    <img src={storyimage} height='50px' width='50px' style={{borderRadius:'50%'}} /><h4>Jai</h4>
                </div>
                
            </div>
        </div>
        </>
    );
}
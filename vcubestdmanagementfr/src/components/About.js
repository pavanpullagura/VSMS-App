import React from 'react';
import './About.css';
import aboutimage from '../images/casual-hologram-job-consultant-standing.jpg';

const About = () => {
    return (
        <>
        <div className='aboutpage'>
            <div className='aboutimagediv'>
                
            </div>
            <section className="about" id="about">
                <h2>About <span>VCUBE</span></h2>
                <p>V Cube is Best Software Training Institute In Hyderabad | KPHB that offers comprehensive training on 
                    a wide range of software technologies, delivered by real-time & full-time industry experts. We also 
                    provide lab sessions after every class to give you hands-on experience. To solidify your learning, you will be required to 
                    work on a mandatory project in a field or domain of your choice, replicating real-time use cases. 
                    In addition to comprehensive training, V Cube also provides a range of career support services to help you land your dream job. 
                    This includes profile / resume building, weekly examinations, mock interviews, continuous LinkedIn profile building activities, 
                    agile methodology practices, online aptitude classes, and job assistance.</p>
            </section>
        </div>
        </>
    );
};

export default About;

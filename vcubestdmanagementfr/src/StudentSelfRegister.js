import { useEffect } from "react";
import axios from "axios";


function StudentSelfRegister(){
    useEffect(() => {
        const askToRegister = async () => {
          try {
            const response = await axios.post(`http://127.0.0.1:8000/student/register/`, {});
            
            console.log(response);
            if (response==201){
                console.log('Successfully Submitted the Request to Register');
            }
            else{
                console.log('Something went wrong');
            }
          } catch (error) {
            console.error('Error While Registering Data', error);
          }
        };
    
        askToRegister();
      });

    return(
        <>
        
        </>
    );
}
export default StudentSelfRegister;
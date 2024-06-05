/* eslint-disable no-case-declarations */
import { getCurrentUser, resetPassword } from "aws-amplify/auth";
import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import './forgotPasswordPage.scss';

const ForgotPasswordPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');

  const sendConfirmationCode = async (e) => {
    e.preventDefault();
    e.target.disabled = true;

    try{
      const response = await resetPassword({
        username: email
      });

      const { nextStep } = response;
      switch(nextStep.resetPasswordStep) {
        case 'CONFIRM_RESET_PASSWORD_WITH_CODE':
          const codeDeliveryDetails = nextStep.codeDeliveryDetails;
          alert(`Confirmation code was sent to ${codeDeliveryDetails.deliveryMedium}`);
          navigate('/resetPassword');
          break;
        case 'DONE':
          alert(`Password successfully reset`);
          break;
      }
    }
    catch (error) {
      alert(`Error occured: ${error.message}`);
      navigate('/login');
    }
  }

  useEffect(() => {
    const isAuthenticated = async () => {
      try {
        await getCurrentUser();
        navigate('/home');
      }
      catch(error) { /* empty */ }
    }

    isAuthenticated();
  }, [navigate]);

  return(
    <div className="forgotContainer">
      <input placeholder="Email" className="inputText" onChange={(e) => setEmail(e.target.value)}></input>
      <button onClick={(e) => sendConfirmationCode(e)}>Send Confirmation Code</button>
    </div>
  );
}

export default ForgotPasswordPage;
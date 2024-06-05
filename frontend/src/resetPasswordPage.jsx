/* eslint-disable no-case-declarations */
import { confirmResetPassword, getCurrentUser } from "aws-amplify/auth";
import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import './resetPasswordPage.scss';

const ResetPasswordPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [confirmationCode, setConfirmationCode] = useState('');
  const [password, setPassword] = useState('');

  const resetPassword = async (e) => {
    e.preventDefault();
    e.target.disabled = true;
    
    try{
      await confirmResetPassword({
        username: email,
        confirmationCode: confirmationCode,
        newPassword: password
      });

      navigate('/login');
    }
    catch (error) {
      alert(`Error occured: ${error.message}`);
      if(error.message.includes("again"))
      {
        navigate('/forgotPassword');

      }
      else if(error.message.includes("limit"))
      {
        navigate('/login');
      }
      else
      {
        navigate('/resetPassword');
        e.target.disabled = false;
      }
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
    <div className="resetContainer">
      <input placeholder="Confirmation code" className="inputText" onChange={(e) => setConfirmationCode(e.target.value)}></input>
      <input placeholder="Email" className="inputText" type="email" onChange={(e) => setEmail(e.target.value)}></input>
      <input placeholder="New Password" className="inputText" type="password" onChange={(e) => setPassword(e.target.value)}></input>
      <button onClick={(e) => resetPassword(e)}>Reset Password</button>
    </div>
  );
}

export default ResetPasswordPage;
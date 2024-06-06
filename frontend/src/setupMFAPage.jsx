import { confirmSignIn, getCurrentUser } from "aws-amplify/auth";
import QRCode from 'qrcode.react';
import {useEffect, useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import './setupMFAPage.scss';

const SetupMFAPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [qrCode] = useState(location.state?.setupUri || '');
  const [code, setCode] = useState('');

  const confirmLogin = async () => {
    try{
      const response = await confirmSignIn({
        challengeResponse: code
      });

      if(response.isSignedIn === true)
      {
        navigate('/home');
      }
    }
    catch (error) {
      alert(`Error occurred: ${error.message}`);
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
    <div className="qrContainer">
      <h3>Multifactor Authentication is enabled.</h3>
      <h4>Add the app to your authenticator by scanning the QR code.</h4>
      <QRCode className="qrCode" value={qrCode} size={200}/>
      <input className="inputText" onChange={(e) => setCode(e.target.value)}></input>
      <button onClick={() => confirmLogin()}>Check OTP</button>
    </div>
  );
}

export default SetupMFAPage;
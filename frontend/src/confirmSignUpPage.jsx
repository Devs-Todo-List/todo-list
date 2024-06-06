import {useState, useEffect} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import { confirmSignUp, getCurrentUser, resendSignUpCode } from "aws-amplify/auth";

const ConfirmSignUpPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState(location.state?.email || '');
  const [password] = useState(location.state?.password || '');
  const [confirmationCode, setConfirmationCode] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await confirmSignUp({
        username: email,
        confirmationCode: confirmationCode
      });

      if(response.isSignUpComplete === true)
      {
        navigate('/login');
      }
    }
    catch(error) {
      alert(`Error occurred: ${error.message}`);
    }
    // try {
    //   await fetch(`${import.meta.env.VITE_API_URL}/api/v1/Auth/confirmSignup`,
    //     {
    //       method: 'POST',
    //       headers: {
    //         'Content-Type': 'application/json',
    //         Accept: 'application/json',
    //       },
    //       body: JSON.stringify({
    //         "username": email,
    //         "code": confirmationCode
    //       })
    //     });

    //   alert("Account confirmed successfully!\nSign in on next page.");
    //   navigate('/login');
    // } catch (error) {
    //   alert(`Failed to confirm account: ${error}`);
    // }
  };

  const handleResendCode = async (e) => {
    e.target.disabled = true;
    await resendSignUpCode({
      username: email,
      password: password,
      options: {
        userAttributes: {
          email: email,
        },
      }
    });
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

  return (
    <div className="loginForm">
      <h2>Confirm Account</h2>
      <h3>Confirmation code sent to email</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            className="inputText"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
        </div>
        <div>
          <input
            className="inputText"
            type="text"
            value={confirmationCode}
            onChange={(e) => setConfirmationCode(e.target.value)}
            placeholder="Confirmation Code"
            required/>
        </div>
        <button type="submit">Confirm Account</button>
      </form>
      <button type="button" onClick={(e) => handleResendCode(e)}>Resend code</button>
    </div>
  );

};

export default ConfirmSignUpPage;
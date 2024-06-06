/* eslint-disable no-case-declarations */
import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import './loginPage.scss'
import { signIn, confirmSignIn, signUp, getCurrentUser } from "aws-amplify/auth";

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const output = await signIn({
        username: email,
        password: password
      });

      await fetch(`${import.meta.env.VITE_API_URL}/api/v1/Auth/signUp`,
        {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json'
          },
          body: JSON.stringify({
            username: email,
            password: password
          })
        });
  
      const { nextStep } = output;
      switch(nextStep.signInStep) {
        case "CONTINUE_SIGN_IN_WITH_TOTP_SETUP":
          const totpSetupDetails = nextStep.totpSetupDetails;
          const appName = 'ToDoList';
          const setupUri = totpSetupDetails.getSetupUri(appName).href;
          navigate('/setupMFA', {state: {setupUri}}); 
          break;
        case "CONFIRM_SIGN_IN_WITH_TOTP_CODE":
          const code = prompt('Enter MFA OTP');
          const response = await confirmSignIn({
            challengeResponse: code
          });

          if(response.isSignedIn === true)
          {
            navigate('/home');
          }

          break;
        case "CONFIRM_SIGN_UP":
          alert("User is not confirmed");
          navigate('/confirm', {state: {email, password}});
          break;
      }
    }
    catch(error) {
      alert(`Error occurred: ${error.message}`);
      setIsSubmitting(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      setIsSubmitting(false);
      return;
    }

    try {
      await signUp({
        username: email,
        password: password,
        options: {
          userAttributes: {
            email: email,
          },
        }
      });
  
      await fetch(`${import.meta.env.VITE_API_URL}/api/v1/Auth/signUp`,
      {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
        },
        body: JSON.stringify({
          username: email,
          password: password
        })
      });

      navigate('/confirm', {state: {email, password}});
    }
    catch (error) {
      alert(`Error occurred: ${error.message}`);
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    navigate('/forgotPassword');
  }

  useEffect(() => {
    const isAuthenticated = async () => {
      try {
        await getCurrentUser();
        navigate('/home');
      }
      catch(error) {
        navigate("/login");
      }
    }

    isAuthenticated();
  }, [navigate]);

  return (
    <div className="loginForm">
      <h1>Welcome to TodoZen</h1>
      <h4>{isSignUp ? 'Sign up to create an account' : 'Sign in to your account'}</h4>
      <form onSubmit={isSignUp ? handleSignUp : handleSignIn}>
        <div>
          <input
            className="inputText"
            id="email"
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
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
        </div>
        {isSignUp && (
          <div>
            <input
              className="inputText"
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              required
            />
          </div>
        )}
        <button type="submit" disabled={isSubmitting}>{isSignUp ? 'Sign Up' : 'Sign In'}</button>
      </form>
      <button onClick={() => setIsSignUp(!isSignUp)}>
        {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
      </button>
      <div>
        <button onClick={(e) => handleForgotPassword(e)}>Forgot password?</button>
      </div>
    </div>    
  );
};

export default LoginPage;
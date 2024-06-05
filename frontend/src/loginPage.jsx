/* eslint-disable no-case-declarations */
import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import './loginPage.scss'
import { signIn, confirmSignIn, signUp } from "aws-amplify/auth";
import QRCode from 'qrcode.react'

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [qrCode, setQRCode] = useState('');
  const [code, setCode] = useState('');
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();

    try {
      const output = await signIn({
        username: email,
        password: password
      });
  
      const { nextStep } = output;
      switch(nextStep.signInStep) {
        case "CONTINUE_SIGN_IN_WITH_TOTP_SETUP":
          const totpSetupDetails = nextStep.totpSetupDetails;
          const appName = 'ToDoList';
          const setupUri = totpSetupDetails.getSetupUri(appName);
          console.log(setupUri);
          setQRCode(setupUri.href);  
          break;
        case "CONFIRM_SIGN_IN_WITH_TOTP_CODE":
          const code = prompt('Enter OTP');
          const response = await confirmSignIn({
            challengeResponse: code
          });

          if(response.isSignedIn === true)
          {
            //const session = await fetchAuthSession();
            //console.log(session.tokens.accessToken.toString());
            //sessionStorage.setItem('accessToken', session.tokens.accessToken.authenticationResult.accessToken);
            window.location.href = '/home';
          }

          console.log(response.isSignedIn);
      }
    }
    catch(error) {
      alert("Error occured:", error);
    }

    // try {
    //   const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/Auth/signIn`,
    //     {
    //       method: 'POST',
    //       headers: {
    //         'Content-Type': 'application/json',
    //         Accept: 'application/json',
    //       },
    //       body: JSON.stringify({
    //         "username": email,
    //         "password": password
    //       })
    //     });

    //   const session = await response.json();
    //   if (session && typeof session !== 'undefined') {
    //     console.log(session);
    //     const mfaCode = prompt("Enter MFA code");
    //     // const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/Auth/mfa`,
    //     //   {
    //     //     method: 'POST',
    //     //     headers: {
    //     //       'Content-Type': 'application/json',
    //     //       Accept: 'application/json',
    //     //     },
    //     //     body: JSON.stringify({
    //     //       "code": mfaCode,
    //     //       "session": session
    //     //     })
    //     //   });
    //     //sessionStorage.setItem('accessToken', session.authenticationResult.accessToken);
    //     if (sessionStorage.getItem('accessToken')) {
    //       window.location.href = '/home';
    //     } else {
    //       console.error('Session token was not set properly.');
    //     }
    //   } else {
    //     console.error('SignIn session or AccessToken is undefined.');
    //   }
    // } catch (error) {
    //   alert(`Sign in failed: ${error}`);
    // }
  };

  const confirmLogin = async () => {
    await confirmSignIn({
      challengeResponse: code
    });
  }

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    const response = await signUp({
      username: email,
      password: password,
      options: {
        userAttributes: {
          email: email,
        },
      }
    });

    console.log(response);

    // try {
    //   await fetch(`${import.meta.env.VITE_API_URL}/api/v1/Auth/signUp`,
    //     {
    //       method: 'POST',
    //       headers: {
    //         'Content-Type': 'application/json',
    //         Accept: 'application/json',
    //       },
    //       body: JSON.stringify({
    //         "username": email,
    //         "password": password
    //       })
    //     });

    //   navigate('/confirm', {state: {email}});
    // } catch (error) {
    //   alert(`Sign up failed: ${error}`);
    // }
  };

  return (
    <>
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
        <button type="submit">{isSignUp ? 'Sign Up' : 'Sign In'}</button>
      </form>
      <button onClick={() => setIsSignUp(!isSignUp)}>
        {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
      </button>
    </div>
    <QRCode value={qrCode}/>
    <input onChange={(e) => setCode(e.target.value)}></input>
    <button onClick={() => confirmLogin()}>Check OTP</button>
    </>
  );
};

export default LoginPage;
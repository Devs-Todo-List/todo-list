import {useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import { confirmSignUp } from "aws-amplify/auth";

const ConfirmUserPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState(location.state?.email || '');
  const [confirmationCode, setConfirmationCode] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await confirmSignUp({
      username: email,
      confirmationCode: confirmationCode
    });

    console.log(response);
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

  return (
    <div className="loginForm">
      <h2>Confirm Account</h2>
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
    </div>
  );

};

export default ConfirmUserPage;
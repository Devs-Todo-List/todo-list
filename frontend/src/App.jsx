import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './loginPage';
import HomePage from './homePage';
import ConfirmSignUpPage from './confirmSignUpPage';
import SetupMFAPage from './setupMFAPage';
import ForgotPasswordPage from './forgotPasswordPage';
import ResetPasswordPage from './resetPasswordPage';
import './App.scss'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate replace to="/home" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/setupMFA" element={<SetupMFAPage />} />
        <Route path="/confirm" element={<ConfirmSignUpPage />} />
        <Route path="/forgotPassword" element={<ForgotPasswordPage />} />
        <Route path="/resetPassword" element={<ResetPasswordPage />} />
        <Route path="/home" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
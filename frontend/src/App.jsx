import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './loginPage';
import HomePage from './homePage';
import BoardPage from './boardPage';
import ConfirmSignUpPage from './confirmSignUpPage';
import SetupMFAPage from './setupMFAPage';
import './App.scss'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate replace to="/home" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/setupMFA" element={<SetupMFAPage />} />
        <Route path="/confirm" element={<ConfirmSignUpPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/board" element={<BoardPage /> }/>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
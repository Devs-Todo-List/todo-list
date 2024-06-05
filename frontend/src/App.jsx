import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './loginPage';
import HomePage from './homePage';
import BoardPage from './boardPage';
import ConfirmUserPage from './confirmUserPage';
import './App.scss'

const App = () => {
  const isAuthenticated = () => {
    const accessToken = sessionStorage.getItem('accessToken');
    return !!accessToken;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={isAuthenticated() ? <Navigate replace to="/board" /> : <Navigate replace to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/confirm" element={<ConfirmUserPage />} />
        <Route path="/home" element={isAuthenticated() ? <HomePage /> : <Navigate replace to="/login" />} />
        <Route path="/board" element={isAuthenticated() ? <BoardPage /> : <Navigate replace to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
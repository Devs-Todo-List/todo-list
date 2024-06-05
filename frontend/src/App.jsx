import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './loginPage';
import HomePage from './homePage';
import BoardPage from './boardPage';
import ConfirmUserPage from './confirmUserPage';
import './App.scss'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate replace to="/home" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/confirm" element={<ConfirmUserPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/board" element={<BoardPage /> }/>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
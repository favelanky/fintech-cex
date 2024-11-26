import React from 'react';
import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import HomeNotAuth from './pages/HomeNotAuth';
import Register from './pages/Register';
import Login from './pages/Login';
import Wallet from './components/Wallet';
import Profile from './pages/Profile';
import Navbar from './components/Navbar';
import { useAuth } from './AuthContext';
import Leaderboard from './pages/Leaderboard';

const App: React.FC = () => {
    const { isAuthenticated, setIsAuthenticated } = useAuth();
    const location = useLocation();
    
    return (
        <>
            {isAuthenticated && <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />}
            <div>
                <Routes>
                    <Route path="/" element={isAuthenticated ? <Home /> : <HomeNotAuth />} />
                    <Route path="/login" element={!isAuthenticated ? 
                        <Login setIsAuthenticated={setIsAuthenticated} /> : 
                        <Navigate to="/" />} />
                    <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/" />} />
                    <Route path="/wallet" element={isAuthenticated ? <Wallet setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/login" />} />
                    <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} />
                    <Route path="/leaderboard" element={<Leaderboard />} />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </div>
        </>
    );
};

export default App;

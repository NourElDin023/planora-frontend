import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggleButton from './ThemeToggle';

const Navbar = () => {
    const navigate = useNavigate();
    const { currentUser, logout } = useAuth();
    
    const handleLogout = () => {
        logout();
        navigate('/login');
    };
    
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary sticky-top">
            <div className="container">
                <Link className="navbar-brand d-flex fw-bold" to="/">
                    <img src="/src/assets/Life-Tracker-logo.png" alt="Life Tracker Logo" height="30" className="me-2" />
                    Life Tracker
                </Link>
                
                <button 
                    className="navbar-toggler" 
                    type="button" 
                    data-bs-toggle="collapse" 
                    data-bs-target="#navbarNav"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/">Home</Link>
                        </li>
                        {currentUser && (
                            <>
                                {/* <li className="nav-item">
                                    <Link className="nav-link" to="/tasks">Tasks</Link>
                                </li> */}
                                <li className="nav-item">
                                    <Link className="nav-link" to="/viewcollections">Collections</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/habits">Habits</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/calendar">Calendar</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/notifications">Notifications</Link>
                                </li>
                            </>
                        )}
                    </ul>
                    
                    <ul className="navbar-nav align-items-center">
                        {!currentUser ? (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/login">Login</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/register">Register</Link>
                                </li>
                            </>
                        ) : (
                            <li className="nav-item dropdown">
                                <a 
                                    className="nav-link dropdown-toggle" 
                                    href="#" 
                                    id="navbarDropdown" 
                                    role="button" 
                                    data-bs-toggle="dropdown"
                                >
                                    Welcome, {currentUser.username}
                                </a>
                                <ul className="dropdown-menu dropdown-menu-end">
                                    <li>
                                        <Link className="dropdown-item" to="/profile">My Profile</Link>
                                    </li>
                                    <li>
                                        <Link className="dropdown-item" to="/settings">Settings</Link>
                                    </li>
                                    <li><hr className="dropdown-divider" /></li>
                                    <li>
                                        <button className="dropdown-item" onClick={handleLogout}>
                                            Logout
                                        </button>
                                    </li>
                                </ul>
                            </li>
                        )}
                        {/* Theme toggle button */}
                        <li className="nav-item">
                            <ThemeToggleButton />
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
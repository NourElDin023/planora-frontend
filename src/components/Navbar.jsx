import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggleButton from './ThemeToggle';
//import NotificationIcon from '/components/NotificationIcon';
import NotificationIcon from './NotificationIcon'; // Adjust the import path as necessary
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
                <Link className="navbar-brand d-flex fw-bold align-items-center" to="/">
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
                                <li className="nav-item">
                                    <Link className="nav-link" to="/viewcollections">Collections</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/shared-collections">Shared Collections</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/calendar">Calendar</Link>
                                </li>
                            </>
                        )}
                    </ul>
                    
                    <ul className="navbar-nav align-items-center gap-2">
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
                            <>
                               
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
                                <li className="nav-item mx-2">
                                    <NotificationIcon />
                                </li>
                            </>
                        )}
                        <li className="nav-item ms-2">
                            <ThemeToggleButton />
                        </li>
                    </ul>
                </div>
            </div>

            {/* Inline styles for notifications */}
            <style>{`
                .notification-icon {
                    position: relative;
                    display: flex;
                    align-items: center;
                }
                .notification-icon button {
                    background: none;
                    border: none;
                    color: white;
                    font-size: 1.25rem;
                    padding: 0.25rem 0.5rem;
                    position: relative;
                    transition: transform 0.2s ease;
                }
                .notification-icon button:hover {
                    transform: scale(1.1);
                }
                .notification-icon span {
                    position: absolute;
                    top: 2px;
                    right: 2px;
                    background: #ff4444;
                    color: white;
                    border-radius: 50%;
                    padding: 2px 6px;
                    font-size: 0.7rem;
                    font-weight: bold;
                }
                .notification-icon .dropdown {
                    position: absolute;
                    right: 0;
                    top: 100%;
                    min-width: 300px;
                    max-height: 50vh;
                    overflow-y: auto;
                    background: white;
                    border: 1px solid #dee2e6;
                    border-radius: 0.5rem;
                    box-shadow: 0 0.5rem 1rem rgba(0,0,0,0.15);
                    z-index: 1050;
                    margin-top: 0.5rem;
                }
                .notification-icon .dropdown div {
                    padding: 1rem;
                    border-bottom: 1px solid #dee2e6;
                    cursor: pointer;
                    transition: background 0.2s ease;
                }
                .notification-icon .dropdown div:hover {
                    background: #f8f9fa;
                }
                .notification-icon .popup {
                    position: fixed;
                    bottom: 1.5rem;
                    right: 1.5rem;
                    background: white;
                    padding: 1rem;
                    border-radius: 0.5rem;
                    box-shadow: 0 0.5rem 1rem rgba(0,0,0,0.15);
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    z-index: 9999;
                    animation: slideIn 0.3s ease-out;
                }
                @keyframes slideIn {
                    from { transform: translateX(100%); }
                    to { transform: translateX(0); }
                }
                .notification-icon .popup button {
                    background: none;
                    border: none;
                    color: #666;
                    font-size: 1.2rem;
                    padding: 0;
                    line-height: 1;
                }
            `}</style>
        </nav>
    );
};

export default Navbar;
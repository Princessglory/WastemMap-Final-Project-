import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2 text-2xl font-bold text-green-600">
            <span>♻️</span>
            <span>WasteMap</span>
          </Link>
          
          <div className="flex items-center space-x-6">
            {currentUser ? (
              <>
                <Link to="/dashboard" className="text-gray-700 hover:text-green-600 font-medium transition-colors">
                  Dashboard
                </Link>
                <Link to="/request-pickup" className="text-gray-700 hover:text-green-600 font-medium transition-colors">
                  Request Pickup
                </Link>
                <Link to="/history" className="text-gray-700 hover:text-green-600 font-medium transition-colors">
                  History
                </Link>
                {currentUser.role === 'collector' || currentUser.role === 'admin' ? (
                  <Link to="/collector" className="text-gray-700 hover:text-green-600 font-medium transition-colors">
                    Collector
                  </Link>
                ) : null}
                {currentUser.role === 'admin' ? (
                  <Link to="/admin" className="text-gray-700 hover:text-green-600 font-medium transition-colors">
                    Admin
                  </Link>
                ) : null}
                <span className="text-gray-600">Welcome, {currentUser.name}</span>
                <button 
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-green-600 font-medium transition-colors">
                  Login
                </Link>
                <Link to="/register" className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors duration-200">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

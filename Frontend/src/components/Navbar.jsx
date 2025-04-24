// src/components/Navbar.js
import { useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Check if the current route matches the link
  const isActive = (path) => {
    return location.pathname === path;
  };

  // Get user initial for the avatar
  const getInitial = () => {
    if (currentUser?.first_name) return currentUser.first_name.charAt(0).toUpperCase();
    if (currentUser?.email) return currentUser.email.charAt(0).toUpperCase();
    return "U";
  };

  return (
    <nav className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <div className="bg-white text-indigo-600 font-bold rounded-lg h-8 w-8 flex items-center justify-center mr-2">P</div>
              <span className="text-xl font-bold">ProfileApp</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <Link 
              to="/" 
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/') 
                  ? 'bg-indigo-800 text-white' 
                  : 'hover:bg-indigo-500 hover:text-white'
              }`}
            >
              Home
            </Link>
            
            {currentUser ? (
              <>
                <Link 
                  to="/profile" 
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/profile') 
                      ? 'bg-indigo-800 text-white' 
                      : 'hover:bg-indigo-500 hover:text-white'
                  }`}
                >
                  Profile
                </Link>
                <button 
                  onClick={logout} 
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-500 transition-colors"
                >
                  Logout
                </button>
                
                {/* User avatar */}
                <Link to="/profile" className="ml-3 flex items-center">
                  <div className="h-8 w-8 rounded-full bg-indigo-200 text-indigo-700 flex items-center justify-center font-medium">
                    {getInitial()}
                  </div>
                </Link>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/login') 
                      ? 'bg-indigo-800 text-white' 
                      : 'hover:bg-indigo-500 hover:text-white'
                  }`}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="ml-2 px-4 py-2 rounded-md text-sm font-medium bg-white text-indigo-600 hover:bg-indigo-50 transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md hover:bg-indigo-500 focus:outline-none"
            >
              {/* Hamburger icon */}
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
            
            {/* User avatar for mobile */}
            {currentUser && (
              <Link to="/profile" className="ml-3">
                <div className="h-8 w-8 rounded-full bg-indigo-200 text-indigo-700 flex items-center justify-center font-medium">
                  {getInitial()}
                </div>
              </Link>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile menu, show/hide based on state */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-indigo-700 pb-3 pt-2">
          <div className="px-2 space-y-1">
            <Link 
              to="/" 
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/') ? 'bg-indigo-800 text-white' : 'hover:bg-indigo-500'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            
            {currentUser ? (
              <>
                <Link 
                  to="/profile" 
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isActive('/profile') ? 'bg-indigo-800 text-white' : 'hover:bg-indigo-500'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Profile
                </Link>
                <button 
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-500"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isActive('/login') ? 'bg-indigo-800 text-white' : 'hover:bg-indigo-500'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/register"
                  className="block px-3 py-2 rounded-md text-base font-medium bg-white text-indigo-600 hover:bg-indigo-50 mt-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
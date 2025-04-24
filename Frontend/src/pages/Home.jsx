// src/pages/Home.js
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
  const { currentUser } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        {/* Hero section */}
        <div className="text-center">
          <div className="flex justify-center mb-8">
            <div className="h-20 w-20 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-3xl font-bold text-white">P</span>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">ProfileApp</span>
          </h1>
          <p className="mb-8 text-xl text-gray-600 max-w-2xl mx-auto">
            A secure and elegant application to manage your personal profile information
          </p>
          
          {currentUser ? (
            <div className="mt-10">
              <div className="bg-white p-8 rounded-xl shadow-md max-w-md mx-auto">
                <div className="flex justify-center mb-4">
                  <div className="h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center">
                    <span className="text-xl font-bold text-indigo-600">
                      {currentUser.first_name ? currentUser.first_name.charAt(0).toUpperCase() : 
                       currentUser.email ? currentUser.email.charAt(0).toUpperCase() : 'U'}
                    </span>
                  </div>
                </div>
                <p className="text-2xl font-semibold mb-4">
                  Hello, {currentUser.first_name || currentUser.email.split('@')[0]}!
                </p>
                <p className="text-gray-600 mb-6">
                  Your profile is ready. View or edit your personal information.
                </p>
                <Link 
                  to="/profile" 
                  className="inline-block w-full bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-lg px-6 py-3 font-medium hover:from-indigo-700 hover:to-indigo-800 transition-all shadow-md"
                >
                  View Your Profile
                </Link>
              </div>
            </div>
          ) : (
            <div className="mt-10">
              <div className="bg-white p-8 rounded-xl shadow-md max-w-md mx-auto">
                <h2 className="text-2xl font-bold mb-4">Get Started</h2>
                <p className="text-gray-600 mb-8">
                  Create an account or sign in to access your personalized profile experience.
                </p>
                <div className="space-y-4">
                  <Link 
                    to="/login" 
                    className="inline-block w-full bg-indigo-600 text-white rounded-lg px-6 py-3 font-medium hover:bg-indigo-700 transition-all shadow-md"
                  >
                    Sign In
                  </Link>
                  <Link 
                    to="/register" 
                    className="inline-block w-full bg-white text-indigo-600 border-2 border-indigo-600 rounded-lg px-6 py-3 font-medium hover:bg-indigo-50 transition-all"
                  >
                    Create Account
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Features section */}
        <div className="mt-24">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Why Choose ProfileApp</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-xl text-indigo-600">🔒</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure & Private</h3>
              <p className="text-gray-600">Your data is encrypted and securely stored. We prioritize your privacy above all.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-xl text-indigo-600">🚀</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast & Responsive</h3>
              <p className="text-gray-600">Enjoy a seamless experience across all your devices with our lightning-fast application.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-xl text-indigo-600">✨</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Beautiful UI</h3>
              <p className="text-gray-600">A clean, modern interface designed to make managing your profile a pleasure.</p>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="mt-24 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} ProfileApp. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
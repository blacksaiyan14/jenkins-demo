// src/pages/Profile.js
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Profile = () => {
  const { currentUser } = useContext(AuthContext);
  console.log(currentUser);

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="p-8 rounded-lg shadow-md bg-white">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full border-4 border-indigo-100 border-t-indigo-500 animate-spin"></div>
            <p className="text-lg font-medium text-gray-700">Loading your profile...</p>
          </div>
        </div>
      </div>
    );
  }

  const getInitial = () => {
    if (currentUser.first_name) return currentUser.first_name.charAt(0).toUpperCase();
    return currentUser.email.charAt(0).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-8 relative">
            <div className="absolute top-4 right-4">
              <Link
                to="/edit-profile"
                className="flex items-center gap-1 bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-1.5 rounded-full text-white text-sm font-medium transition-all"
              >
                <span className="text-xs mr-1">✏️</span>
                <span>Edit</span>
              </Link>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-3xl text-indigo-600 font-bold shadow-lg">
                {getInitial()}
              </div>
              <h1 className="mt-4 text-xl font-bold text-white">
                {currentUser.first_name && currentUser.last_name 
                  ? `${currentUser.first_name} ${currentUser.last_name}`
                  : 'Your Profile'}
              </h1>
              
              <p className="text-indigo-100 mt-1 flex items-center gap-1">
                <span className="text-xs mr-1">✉️</span>
                {currentUser.email}
              </p>
            </div>
          </div>
          
          <div className="px-6 py-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h2>
            
            <div className="space-y-4">
              <div className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="bg-indigo-100 p-2 rounded-lg mr-4 w-10 h-10 flex items-center justify-center">
                  <span className="text-lg text-indigo-600">👤</span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">First Name</p>
                  <p className="font-medium text-gray-800">{currentUser.first_name || 'Not provided'}</p>
                </div>
              </div>

              <div className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="bg-indigo-100 p-2 rounded-lg mr-4 w-10 h-10 flex items-center justify-center">
                  <span className="text-lg text-indigo-600">👤</span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Last Name</p>
                  <p className="font-medium text-gray-800">{currentUser.last_name || 'Not provided'}</p>
                </div>
              </div>
              
              <div className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="bg-indigo-100 p-2 rounded-lg mr-4 w-10 h-10 flex items-center justify-center">
                  <span className="text-lg text-indigo-600">✉️</span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email Address</p>
                  <p className="font-medium text-gray-800">{currentUser.email}</p>
                </div>
              </div>

              {currentUser.location && (
                <div className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="bg-indigo-100 p-2 rounded-lg mr-4 w-10 h-10 flex items-center justify-center">
                    <span className="text-lg text-indigo-600">📍</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium text-gray-800">{currentUser.location}</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="mt-8">
              <Link
                to="/edit-profile"
                className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 font-medium"
              >
                <span>Edit Your Profile</span>
                <span className="ml-1">→</span>
              </Link>
            </div>
          </div>
        </div>
        
        <div className="mt-6 px-2">
          <div className="flex justify-between items-center space-x-4">
            <Link to="/settings" className="text-gray-600 hover:text-indigo-600 text-sm font-medium">
              Account Settings
            </Link>
            <Link to="/security" className="text-gray-600 hover:text-indigo-600 text-sm font-medium">
              Security & Privacy
            </Link>
            <Link to="/help" className="text-gray-600 hover:text-indigo-600 text-sm font-medium">
              Help & Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
// src/App.js
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './pages/ProtectedRoutes';


function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <div className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/edit-profile" element={
                <ProtectedRoute>
                  <EditProfile />
                </ProtectedRoute>
              } />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;










// src/pages/EditProfile.js



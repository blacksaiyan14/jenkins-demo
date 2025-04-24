
import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password
      });
      
      navigate('/profile');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="username">Name</label>
          <input
            id="username"
            name="username"
            type="text"
            value={formData.username}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-indigo-300"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-indigo-300"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-indigo-300"
            required
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 mb-2" htmlFor="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-indigo-300"
            required
          />
        </div>
        
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white p-3 rounded hover:bg-indigo-700 disabled:bg-indigo-400"
          disabled={loading}
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
      
      <p className="mt-4 text-center">
        Already have an account?{' '}
        <Link to="/login" className="text-indigo-600 hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
};

export default Register;
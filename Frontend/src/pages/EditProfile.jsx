
import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const EditProfile = () => {
  const { currentUser, updateProfile } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    last_name: '',
    first_name: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (currentUser) {
      setFormData({
        username: currentUser.username || '',
        email: currentUser.email || '',
        first_name: currentUser.first_name || '',
        last_name: currentUser.last_name || '',
      });
    }
  }, [currentUser]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError('');
      
      await updateProfile(formData);
      navigate('/profile');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Edit Profile</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="username">Username</label>
          <input
            id="username"
            name="username"
            type="text"
            value={formData.username}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-indigo-300"
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
            readOnly
          />
          <p className="text-sm text-gray-500 mt-1">Email cannot be changed</p>
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 mb-2" htmlFor="first_name">First name</label>
          <input
            id="first_name"
            name="first_name"
            type="text"
            value={formData.first_name}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-indigo-300"
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 mb-2" htmlFor="last_name">Last name</label>
          <input
            id="last_name"
            name="last_name"
            type="text"
            value={formData.last_name}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-indigo-300"
          />
        </div>
        
        <div className="flex space-x-4">
          <button
            type="submit"
            className="flex-1 bg-indigo-600 text-white p-3 rounded hover:bg-indigo-700 disabled:bg-indigo-400"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
          
          <button
            type="button"
            onClick={() => navigate('/profile')}
            className="flex-1 bg-gray-300 text-gray-800 p-3 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
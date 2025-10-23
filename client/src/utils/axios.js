// Import axios
import axios from 'axios';

// Set base URL dynamically based on environment
const getBaseURL = () => {
  // For production on Vercel
  if (process.env.NODE_ENV === 'production') {
    return window.location.origin;
  }
  // For local development
  return 'http://localhost:8080';
};

axios.defaults.baseURL = getBaseURL();

// Add request interceptor
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle token expiration
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axios;
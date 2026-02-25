const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const prodBackend = 'https://trellis-wqgz.onrender.com';

export const API_BASE_URL = process.env.REACT_APP_API_URL || process.env.REACT_APP_API_BASE_URL || (isLocal ? 'http://localhost:5000' : prodBackend);

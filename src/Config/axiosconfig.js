// src/api/axiosConfig.js
import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

// Create axios instance with credentials
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Important: This allows cookies to be sent with requests
});

export default api;
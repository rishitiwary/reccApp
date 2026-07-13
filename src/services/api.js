import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL, institute_id } from '../config/config';

// Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add token and institute_id to every request
api.interceptors.request.use(
  async (config) => {
    try {
      // Get user info from AsyncStorage
      const userInfoStr = await AsyncStorage.getItem('userInfo');
      
      if (userInfoStr) {
        const userInfo = JSON.parse(userInfoStr);
        const token = userInfo.token; // Token from login response
        const user = userInfo.data;
        
        // Add Authorization Bearer token
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        
        // Add X-User-ID header
        if (user?.id) {
          config.headers['X-User-ID'] = user.id;
        }
        
        // Add X-Institute-ID header (from user or config)
        const userInstituteId = user?.institute_id || institute_id;
        if (userInstituteId) {
          config.headers['X-Institute-ID'] = userInstituteId;
        }
      } else {
        // For public routes, still send institute_id
        if (institute_id) {
          config.headers['X-Institute-ID'] = institute_id;
        }
      }
      
      return config;
    } catch (error) {
      console.log('Axios interceptor error:', error);
      return config;
    }
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Handle 401 unauthorized errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - logout user
      await AsyncStorage.removeItem('userInfo');
      // You can add navigation to login screen here if needed
      console.log('Unauthorized - Token expired or invalid');
    }
    return Promise.reject(error);
  }
);

export default api;

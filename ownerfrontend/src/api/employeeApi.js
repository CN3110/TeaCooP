import axios from 'axios';

// Use the correct base URL (note the /api prefix)
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001') + '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor for authentication
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config}, 
  error => {
    return Promise.reject(error);
  }
);

// Employee API functions
export const getEmployees = () => api.get('/employees');
export const createEmployee = (employee) => api.post('/employees', employee);
export const updateEmployee = (id, employee) => api.put(`/employees/${id}`, employee);
export const deleteEmployee = (id) => api.delete(`/employees/${id}`);

export default {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee
};
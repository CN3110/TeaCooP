import { Navigate, Outlet } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const AuthGuard = ({ allowedRoles }) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/login" />;
  }

  try {
    const decoded = jwtDecode(token);
    const userRole = decoded.userType; // Assuming your JWT contains userType
    
    if (!allowedRoles.includes(userRole)) {
      return <Navigate to="/login" />;
    }
    
    return <Outlet />;
  } catch (error) {
    console.error('Invalid token:', error);
    return <Navigate to="/login" />;
  }
};

export default AuthGuard;
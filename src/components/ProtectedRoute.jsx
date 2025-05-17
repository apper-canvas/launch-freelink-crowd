import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ClientLayout from './layout/ClientLayout';

const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const location = useLocation();

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user has required role
  const hasRequiredRole = allowedRoles.length === 0 || 
    (user && allowedRoles.includes(user.role));

  if (!hasRequiredRole) {
    // Redirect to unauthorized page or home based on user type
    return <Navigate to="/" replace />;
  }

  // Return outlet wrapped in appropriate layout based on user role
  if (user?.role === 'client') {
    return (
      <ClientLayout><Outlet /></ClientLayout>
    );
  }

  // Default case
  return <Outlet />;
};

export default ProtectedRoute;
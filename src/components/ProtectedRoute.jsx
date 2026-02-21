import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const localUser = localStorage.getItem('colonizer_admin_token');
  if (!localUser) {
    return <Navigate to="/auth/signin" replace />;
  }
  return children;
};

export default ProtectedRoute; 
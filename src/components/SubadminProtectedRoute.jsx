import { Navigate } from 'react-router-dom';

const SubadminProtectedRoute = ({ children }) => {
  const localSubadmin = localStorage.getItem('adc_aspirants_subadmin');
  const localSubadminToken = localStorage.getItem('adc_aspirants_subadmin_token');
  if (!localSubadmin || !localSubadminToken) {
    return <Navigate to="/auth/subadmin/signin" replace />;
  }
  return children;
};

export default SubadminProtectedRoute; 
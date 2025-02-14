import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { showAuthForm } from '../utils/auth';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    showAuthForm('signIn');
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;

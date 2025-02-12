import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { showAuthForm } from '../utils/auth';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      // Only hide sections and show login when accessing protected routes
      if (window.location.hash.match(/#(pricing|howToUse)/)) {
        const mainSections = document.querySelectorAll('section');
        mainSections.forEach(section => {
          section.style.display = 'none';
        });
        showAuthForm('signIn');
      }
    }
  }, [user]);

  if (!user) {
    return null;
  }

  return children;
};

export default ProtectedRoute;

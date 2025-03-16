import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [navigateSignIn, setNavigateSignIn] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (!user) {
      setShowModal(true);
      const modalTimer = setTimeout(() => {
        setShowModal(false);
        setNavigateSignIn(true);
      }, 2000);

      return () => clearTimeout(modalTimer);
    } else {
      setShowModal(false);
      setNavigateSignIn(false);
    }
  }, [user]);

  if (!user) {
    return (
      <>
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-n-8/50 backdrop-blur-sm">
            <div className="bg-n-7 rounded-lg shadow-md p-8 w-96 border border-n-6">
              <div className="flex items-center justify-center mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 text-blue-600" // Adjust to your primary color
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.0a1 1 0 01-1 1h-1a1 1 0 01-1-1v-3a1 1 0 011-1h1a1 1 0 011 1zm3-7v12a3 3 0 11-6 0V4a3 3 0 116 0z"
                  />
                </svg>
              </div>
              <p className="text-center text-xl font-semibold mb-4 text-n-1">
                Please Sign In
              </p>
              <p className="text-center text-n-1/50">
                To unlock the best outfits!
              </p>
            </div>
          </div>
        )}
        {navigateSignIn && (
          <Navigate to="/signIn" state={{ from: location }} replace />
        )}
      </>
    );
  }

  return children;
};

export default ProtectedRoute;

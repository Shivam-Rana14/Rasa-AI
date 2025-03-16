import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Initial loading state
  const [error, setError] = useState(null);

  // Check for existing session on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false); // Set loading to false after checking session
  }, []);

  const signup = async (name, email, password) => {
    setLoading(true); // Set loading to true at the start
    setError(null); // Clear any previous errors

    try {
      const response = await fetch(
        "https://rasa-ai.onrender.com/api/auth/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email, password }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      return { success: true, message: data.message };
    } catch (err) {
      setError(err.message); // Set the error state
      return { success: false, message: err.message };
    } finally {
      setLoading(false); // Reset loading to false after the operation
    }
  };

  const signin = async (email, password) => {
    setLoading(true); // Set loading to true at the start
    setError(null); // Clear any previous errors

    try {
      const response = await fetch(
        "https://rasa-ai.onrender.com/api/auth/signin",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Invalid credentials");
      }

      setUser(data.user);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      return { success: true };
    } catch (err) {
      setError(err.message); // Set the error state
      return { success: false, message: err.message };
    } finally {
      setLoading(false); // Reset loading to false after the operation
    }
  };

  const signout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, error, setError, signup, signin, signout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

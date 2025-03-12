import { useState, useEffect } from "react"; // Add useEffect
import { useAuth } from "../context/AuthContext";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import LoadingSpinner from "./LoadingSpinner";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordMismatchError, setPasswordMismatchError] = useState("");
  const { signup, loading, error, setError } = useAuth();
  const navigate = useNavigate();

  // Reset form and errors when the component mounts
  useEffect(() => {
    resetForm();
    setPasswordMismatchError("");
    setError("");
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous errors
    setPasswordMismatchError("");
    setError("");

    // Check if passwords match
    if (password !== confirmPassword) {
      setPasswordMismatchError("Passwords do not match!");
      resetPassword();
      return;
    }

    try {
      const result = await signup(name, email, password);
      if (result && result.success) {
        resetForm();
        navigate("/signin");
      }
    } catch (err) {
      console.error("Sign-up error:", err);
      resetForm();
    }
  };

  const resetPassword = () => {
    setConfirmPassword("");
    setPassword("");
  };

  const resetForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <>
      {loading && <LoadingSpinner />}
      <div
        id="signUp-form"
        className="flex min-h-screen items-center justify-center bg-n-8 px-5"
      >
        <div className="w-full max-w-md rounded-2xl bg-n-7 p-8">
          <h2 className="mb-6 text-3xl font-bold text-n-1">
            Create New Account
          </h2>
          {error && <p className="mb-4 text-red-500">{error}</p>}
          {passwordMismatchError && (
            <p className="mb-4 text-red-500">{passwordMismatchError}</p>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="mb-2 block text-n-1" htmlFor="signup-name">
                Name
              </label>
              <input
                id="signup-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg bg-n-6 px-4 py-3 text-n-1"
                required
              />
            </div>
            <div className="mb-4">
              <label className="mb-2 block text-n-1" htmlFor="signup-email">
                Email
              </label>
              <input
                id="signup-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg bg-n-6 px-4 py-3 text-n-1"
                required
              />
            </div>
            <div className="mb-6 relative">
              <label className="mb-2 block text-n-1" htmlFor="signup-password">
                Password
              </label>
              <input
                id="signup-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg bg-n-6 px-4 py-3 text-n-1 pr-10"
                required
              />
              <button
                type="button"
                className="absolute mt-8 inset-y-0 right-3 flex items-center"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5 text-n-3" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-n-3" />
                )}
              </button>
            </div>
            <div className="mb-6 relative">
              <label className="mb-2 block text-n-1" htmlFor="confirm-password">
                Confirm Password
              </label>
              <input
                id="confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-lg bg-n-6 px-4 py-3 text-n-1 pr-10"
                required
              />
              <button
                type="button"
                className="absolute mt-8 inset-y-0 right-3 flex items-center"
                onClick={toggleConfirmPasswordVisibility}
              >
                {showConfirmPassword ? (
                  <EyeSlashIcon className="h-5 w-5 text-n-3" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-n-3" />
                )}
              </button>
            </div>
            <Button
              className="w-full justify-center"
              disabled={loading}
              type="submit"
            >
              {loading ? "Creating account..." : "Create Account"}
            </Button>
          </form>
        </div>
      </div>
    </>
  );
};

export default SignUp;

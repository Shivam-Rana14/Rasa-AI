import { useState, useEffect } from "react";
import { useAuth } from "../store/AuthContext";
import Button from "./Button";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";
import confetti from "canvas-confetti";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { signin, loading, error, setError } = useAuth();
  const navigate = useNavigate();

  function handleNameClick() {
    const duration = 2 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        clearInterval(interval);
        return;
      }

      const particleCount = 50 * (timeLeft / duration);

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);
  }

  // Reset form and errors when the component mounts
  useEffect(() => {
    resetForm();
    setError("");
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous errors
    setError("");

    try {
      const result = await signin(email, password);
      if (result && result.success) {
        resetForm();
        navigate("/");
        handleNameClick();
      }
    } catch (err) {
      console.error("Sign-in error:", err);
      resetForm();
    }
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      {loading && <LoadingSpinner />}
      <div
        id="signIn-form"
        className="flex min-h-screen items-center justify-center bg-n-8 px-5"
      >
        <div className="w-full max-w-md rounded-2xl bg-n-7 p-8">
          <h2 className="mb-6 text-3xl font-bold text-n-1">Sign In</h2>
          {error && <p className="mb-4 text-red-500">{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="mb-2 block text-n-1" htmlFor="signin-email">
                Email
              </label>
              <input
                id="signin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg bg-n-6 px-4 py-3 text-n-1"
                required
              />
            </div>
            <div className="mb-6 relative">
              <label className="mb-2 block text-n-1" htmlFor="signin-password">
                Password
              </label>
              <input
                id="signin-password"
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
            <Button
              className="w-full justify-center"
              disabled={loading}
              type="submit"
            >
              {loading
                ? "Please wait this request can take upto 2 minutes due to high traffic on our servers"
                : "Sign In"}
            </Button>
          </form>
        </div>
      </div>
    </>
  );
};

export default SignIn;

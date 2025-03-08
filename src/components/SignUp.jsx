import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Button from "./Button";
import { hideAuthForm } from "../utils/auth";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signup, loading, error } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await signup(name, email, password);
    if (result.success) {
      // Reset form
      setName("");
      setEmail("");
      setPassword("");
      // Redirect to sign in after 2 seconds
      setTimeout(() => {
        hideAuthForm("signUp");
        document.getElementById("signIn").classList.remove("hidden");
        document.getElementById("signIn").style.display = "block";
      }, 20);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-n-8 px-5">
      <div className="w-full max-w-md rounded-2xl bg-n-7 p-8">
        <h2 className="mb-6 text-3xl font-bold text-n-1">Create New Account</h2>
        {error && <p className="mb-4 text-red-500">{error}</p>}
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
          <div className="mb-6">
            <label className="mb-2 block text-n-1" htmlFor="signup-password">
              Password
            </label>
            <input
              id="signup-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg bg-n-6 px-4 py-3 text-n-1"
              required
            />
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
  );
};

export default SignUp;

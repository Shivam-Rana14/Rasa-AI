import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Button from "./Button";
import { hideAuthForm } from "../utils/auth";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signin, loading, error } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await signin(email, password);
    if (result.success) {
      // Reset form
      setEmail("");
      setPassword("");
      hideAuthForm("signIn");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-n-8 px-5">
      <div className="w-full max-w-md rounded-2xl bg-n-7 p-8">
        <h2 className="mb-6 text-3xl font-bold text-n-1">Sign In</h2>
        {error && <p className="mb-4 text-red-500">{error}</p>}
        <form onSubmit={handleSubmit} id="signIn-form">
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
          <div className="mb-6">
            <label className="mb-2 block text-n-1" htmlFor="signin-password">
              Password
            </label>
            <input
              id="signin-password"
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
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default SignIn;

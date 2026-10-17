
import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/forgot-password", {
        email: email.trim(),
      });

      setMessage(
        response.data?.message ||
          "If an account exists for this email, reset instructions will be sent."
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to process your request. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12 text-white">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">
            Coding<span className="text-cyan-400">Bhai</span>
          </h1>

          <h2 className="mt-6 text-2xl font-bold">
            Forgot Password?
          </h2>

          <p className="mt-2 text-slate-400">
            Enter your registered email to receive a password reset link.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium"
            >
              Email Address
            </label>

            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your registered email"
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-400"
            />
          </div>

          {message && (
            <p role="status" className="text-sm text-green-400">
              {message}
            </p>
          )}

          {error && (
            <p role="alert" className="text-sm text-red-400">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-cyan-500 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <p className="text-center text-slate-400">
          Remember your password?{" "}
          <Link
            to="/login"
            className="text-cyan-400 hover:text-cyan-300"
          >
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;

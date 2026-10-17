
import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../../services/api";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!token) {
      setError("Reset token is missing. Please request a new link.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/reset-password", {
        token,
        newPassword: password,
      });

      setMessage(
        response.data?.message ||
          "Password reset successful. Please log in."
      );
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Reset failed. Your link may be invalid or expired."
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
            Reset Password
          </h2>

          <p className="mt-2 text-slate-400">
            Choose a new password for your account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="password" className="mb-2 block text-sm">
              New Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              minLength={8}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 outline-none focus:border-cyan-400"
              placeholder="At least 8 characters"
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-2 block text-sm"
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 outline-none focus:border-cyan-400"
              placeholder="Enter password again"
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
            disabled={loading || Boolean(message)}
            className="w-full rounded-lg bg-cyan-500 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:opacity-50"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <p className="text-center">
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

export default ResetPassword;

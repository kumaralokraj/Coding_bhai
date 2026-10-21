
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

import AuthInput from "./AuthInput";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { googleLogin } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Normal email and password login
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      alert("Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      const token = response.data?.token;
      const user = response.data?.user;

      if (!token || !user) {
        throw new Error("Token or user was not received from server");
      }

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      alert("Login successful 🎉");
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Login Error:", error);

      alert(
        error.response?.data?.message ||
          error.message ||
          "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Google login
  const handleGoogleSuccess = async (credentialResponse) => {
    if (!credentialResponse?.credential) {
      alert("Google credential was not received.");
      return;
    }

    try {
      setGoogleLoading(true);

      const response = await googleLogin(
        credentialResponse.credential
      );

      if (!response?.token || !response?.user) {
        throw new Error("Token or user was not received from server");
      }

      alert("Google login successful 🎉");
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Google Login Error:", error);

      alert(
        error.response?.data?.message ||
          error.message ||
          "Google login failed. Please try again."
      );
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12 text-white">
      <div className="w-full max-w-md space-y-8">

        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold">
            Coding<span className="text-cyan-400">Bhai</span>
          </h1>

          <h2 className="mt-6 text-2xl font-bold">
            Welcome Back
          </h2>

          <p className="mt-2 text-slate-400">
            Sign in to your account
          </p>
        </div>

        {/* Email and Password Login */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <AuthInput
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
          />

          <AuthInput
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
          />

          <div className="-mt-3 flex justify-end">
            <Link
              to="/forgot-password"
              className="text-sm text-cyan-400 transition hover:text-cyan-300"
            >
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading || googleLoading}
            className="w-full rounded-lg bg-cyan-500 py-2 font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-4">
          <div className="h-px flex-1 bg-slate-700" />
          <span className="text-sm text-slate-400">OR</span>
          <div className="h-px flex-1 bg-slate-700" />
        </div>

        {/* Continue with Google */}
        <div className="flex flex-col items-center gap-3">
          {googleLoading ? (
            <p className="text-sm text-cyan-400">
              Signing in with Google...
            </p>
          ) : (
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => {
                alert("Google sign-in failed. Please try again.");
              }}
              text="continue_with"
              theme="outline"
              shape="rectangular"
              width="320"
            />
          )}
        </div>

        {/* Signup Link */}
        <p className="text-center text-slate-400">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-cyan-400 hover:text-cyan-300"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
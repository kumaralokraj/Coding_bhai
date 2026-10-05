import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthInput from "./AuthInput";
import api from "../../services/api";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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

    console.log("LOGIN FULL RESPONSE:", response);
    console.log("LOGIN DATA:", response.data);

    const token = response.data?.token;
    const user = response.data?.user;

    if (!token) {
      console.error("Token missing from login response");
      alert("Login successful but token was not received from server.");
      return;
    }

    // Save JWT
    localStorage.setItem("token", token);

    // Save user
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    }

    // Verify token saved
    console.log(
      "TOKEN SAVED:",
      localStorage.getItem("token")
    );

    alert("Login successful 🎉");

    // Home page
    navigate("/");
  } catch (error) {
    console.error("Login Error:", error);

    alert(
      error.response?.data?.message ||
        "Login failed. Please try again."
    );
  } finally {
    setLoading(false);
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

        {/* Login Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
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

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-cyan-500 py-2 font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

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
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";

const AuthLayout = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
    
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            Coding Bhai
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Master Coding, Crack Interviews
          </p>
        </div>

        {children}

        <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>
            By using this site, you agree to our{" "}
            <Link to="/terms" className="text-blue-600 hover:underline">
              Terms & Conditions
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="text-blue-600 hover:underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;

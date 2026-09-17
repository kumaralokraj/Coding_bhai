import { Routes, Route } from "react-router-dom";

// Pages
import Home from "./pages/Home";
import Leaderboard from "./pages/Leaderboard";
import Settings from "./pages/Settings";

// Auth Pages
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";

// Profile Pages
import Profile from "./pages/profile/Profile";

// Dashboard Pages
import Dashboard from "./pages/dashboard/Dashboard";

// Contests Pages
import Contests from "./pages/contests/Contests";
import ContestDetails from "./pages/contests/ContestDetails";

// Interview Pages
import Interview from "./pages/interview/Interview";
import InterviewSession from "./pages/interview/InterviewSession";
import InterviewSetup from "./pages/interview/InterviewSetup";
import InterviewResult from "./pages/interview/InterviewResult";

// Problems Pages
import Problems from "./pages/problems/Problems";
import ProblemDetails from "./pages/problems/ProblemDetails";

// Learn Pages
import Learn from "./pages/learn/Learn";
import CourseDetails from "./pages/learn/CourseDetails";
import Lesson from "./pages/learn/Lesson";
import ProblemSolve from "./pages/problems/ProblemSolve";
function App() {
  return (
    <Routes>
      {/* Home & Main Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/leaderboard" element={<Leaderboard />} />
      <Route path="/settings" element={<Settings />} />

      {/* Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Profile Routes */}
      <Route path="/profile" element={<Profile />} />

      {/* Dashboard Routes */}
      <Route path="/dashboard" element={<Dashboard />} />

      {/* Contests Routes */}
      <Route path="/contests" element={<Contests />} />
      <Route path="/contests/:id" element={<ContestDetails />} />

      {/* Interview Routes */}
      <Route path="/interview" element={<Interview />} />
      <Route path="/interview/setup" element={<InterviewSetup />} />
      <Route path="/interview/session/:id" element={<InterviewSession />} />
      <Route path="/interview/result/:id" element={<InterviewResult />} />

      {/* Problems Routes */}
      <Route path="/problems" element={<Problems />} />
      <Route path="/problems/:id" element={<ProblemDetails />} />

      {/* Learn Routes */}
      <Route path="/learn" element={<Learn />} />
      <Route path="/learn/:courseId" element={<CourseDetails />} />
      <Route path="/learn/:courseId/lesson/:lessonId" element={<Lesson />} />
      <Route path="/problems/:id" element={<ProblemDetails />} />

      <Route path="/problems/:id/solve" element={<ProblemSolve />} />
    </Routes>
  );
}

export default App;

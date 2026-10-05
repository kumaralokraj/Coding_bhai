import { Routes, Route } from "react-router-dom";

// Layout
import AppLayout from "./components/layout/AppLayout";


// Pages
import Home from "./pages/Home";
import Leaderboard from "./pages/Leaderboard";
import Settings from "./pages/Settings";

// Auth Pages
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";

// Profile
import Profile from "./pages/profile/Profile";

// Dashboard
import Dashboard from "./pages/dashboard/Dashboard";

// Contests
import Contests from "./pages/contests/Contests";
import ContestDetails from "./pages/contests/ContestDetails";

// Interview
import Interview from "./pages/interview/Interview";
import InterviewSession from "./pages/interview/InterviewSession";
import InterviewSetup from "./pages/interview/InterviewSetup";
import InterviewResult from "./pages/interview/InterviewResult";

// Problems
import Problems from "./pages/problems/Problems";
import ProblemDetails from "./pages/problems/ProblemDetails";
import ProblemSolve from "./pages/problems/ProblemSolve";

// Learn
import Learn from "./pages/learn/Learn";
import CourseDetails from "./pages/learn/CourseDetails";
import Lesson from "./pages/learn/Lesson";

// AI
import AIMentor from "./components/ai/AIMentor";

function App() {
  return (
    <Routes>

      {/* ================= AUTH ================= */}

      {/* No Sidebar */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />


      {/* ================= MAIN APP ================= */}

      {/* Sidebar stays mounted */}
      <Route element={<AppLayout />}>
      <Route
  path="/problems/:id"
  element={<ProblemDetails />}
/>

<Route
  path="/problems/:id/solve"
  element={<ProblemSolve />}
/>

        {/* Home */}
        <Route path="/" element={<Home />} />

        {/* Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Profile */}
        <Route path="/profile" element={<Profile />} />

        {/* Settings */}
        <Route path="/settings" element={<Settings />} />

        {/* Leaderboard */}
        <Route path="/leaderboard" element={<Leaderboard />} />


        {/* ================= CONTESTS ================= */}

        <Route path="/contests" element={<Contests />} />

        <Route
          path="/contests/:id"
          element={<ContestDetails />}
        />


        {/* ================= INTERVIEW ================= */}

        <Route
          path="/interview"
          element={<Interview />}
        />

        <Route
          path="/interview/setup"
          element={<InterviewSetup />}
        />

        <Route
          path="/interview/session/:id"
          element={<InterviewSession />}
        />

        <Route
          path="/interview/result/:id"
          element={<InterviewResult />}
        />


        {/* ================= PROBLEMS ================= */}

        <Route
          path="/problems"
          element={<Problems />}
        />

        <Route
          path="/problems/:id"
          element={<ProblemDetails />}
        />

        <Route
          path="/problems/:id/solve"
          element={<ProblemSolve />}
        />


        {/* ================= LEARN ================= */}

        <Route
          path="/learn"
          element={<Learn />}
        />

        <Route
          path="/learn/:courseId"
          element={<CourseDetails />}
        />

        <Route
          path="/learn/:courseId/lesson/:lessonId"
          element={<Lesson />}
        />


        {/* ================= AI MENTOR ================= */}

        <Route
          path="/ai-mentor"
          element={<AIMentor />}
        />

      </Route>

    </Routes>
  );
}

export default App;
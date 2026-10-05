import { Link } from "react-router-dom";

import Hero from "../components/landing/Hero";
import Features from "../components/landing/Features";
import HowItWorks from "../components/landing/HowItWorks";
import CTASection from "../components/landing/CTASection";

function Home() {
  const token = localStorage.getItem("token");

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* Top Bar */}
      <header
        className="
          sticky top-0 z-30
          flex h-16 items-center
          justify-end
          border-b border-slate-800
          bg-slate-950/90
          px-5
          backdrop-blur
          lg:px-8
        "
      >

        {/* Auth Section */}
       {/* ================= AUTH SECTION ================= */}
<div className="flex items-center gap-3">

  {token ? (
    // LOGGED IN
    <button
      onClick={() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/";
      }}
      className="
        rounded-xl
        bg-red-500/10
        px-5 py-2
        text-sm
        font-semibold
        text-red-400
        transition
        hover:bg-red-500/20
        hover:text-red-300
      "
    >
      Logout
    </button>
  ) : (
    // LOGGED OUT
    <>
      <Link
        to="/login"
        className="
          rounded-xl
          px-4 py-2
          text-sm
          font-medium
          text-slate-300
          transition
          hover:bg-slate-800
          hover:text-white
        "
      >
        Login
      </Link>

      <Link
        to="/signup"
        className="
          rounded-xl
          bg-cyan-500
          px-5 py-2
          text-sm
          font-semibold
          text-slate-950
          transition
          hover:bg-cyan-400
        "
      >
        Sign Up
      </Link>
    </>
  )}

</div>
      </header>

      {/* Landing Page */}
      <Hero />
      <Features />
      <HowItWorks />
      <CTASection />

    </div>
  );
}

export default Home;
// import { useState } from "react";
// import Sidebar from "../components/layout/Sidebar";
// import MobileSidebar from "../components/layout/MobileSidebar";
// import Hero from "../components/landing/Hero";
// import HowItWorks from "../components/landing/HowItWorks";
// import Features from "../components/landing/Features";
// import CTASection from "../components/landing/CTASection";
// function Home() {
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

//   return (
//     <div className="min-h-screen bg-slate-950 text-white">
      
//       <Sidebar />

//       <MobileSidebar
//         isOpen={isMobileMenuOpen}
//         onClose={() => setIsMobileMenuOpen(false)}
//       />

//       {/* Mobile Header */}
//       <header className="flex h-16 items-center justify-between border-b border-slate-800 px-5 lg:hidden">
//         <h1 className="text-xl font-bold">
//           Coding<span className="text-cyan-400">Bhai</span>
//         </h1>

//         <button
//           onClick={() => setIsMobileMenuOpen(true)}
//           className="rounded-lg border border-slate-700 px-3 py-2 text-xl"
//         >
//           ☰
//         </button>
//       </header>

//       {/* Main Content */}
//       <main className="lg:ml-64">
//         <Hero />
//         <Features/>
//         <HowItWorks/>
//         <CTASection/>

//       </main>

//     </div>
//   );
// }

// export default Home;
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Sidebar from "../components/layout/Sidebar";
import MobileSidebar from "../components/layout/MobileSidebar";

import Hero from "../components/landing/Hero";
import Features from "../components/landing/Features";
import HowItWorks from "../components/landing/HowItWorks";
import CTASection from "../components/landing/CTASection";

function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigate = useNavigate();

  // Check login status
  const token = localStorage.getItem("token");

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* ================= SIDEBAR ================= */}
      <Sidebar />

      {/* ================= MOBILE SIDEBAR ================= */}
      <MobileSidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* ================= TOP BAR ================= */}
      <header
        className="
          sticky top-0 z-30
          flex h-16 items-center justify-between
          border-b border-slate-800
          bg-slate-950/90
          px-5
          backdrop-blur
          lg:ml-64
          lg:px-8
        "
      >

        {/* ================= MOBILE LEFT ================= */}
        <div className="flex items-center gap-3">

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="
              rounded-lg
              border border-slate-700
              px-3 py-1.5
              text-xl
              transition
              hover:bg-slate-800
              lg:hidden
            "
          >
            ☰
          </button>

          {/* Mobile Logo */}
          <Link
            to="/"
            className="text-xl font-bold lg:hidden"
          >
            Coding<span className="text-cyan-400">Bhai</span>
          </Link>

        </div>

        {/* ================= AUTH SECTION ================= */}
        <div className="ml-auto flex items-center gap-3">

          {token ? (

            // ================= LOGGED IN =================
            <button
              onClick={handleLogout}
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

            // ================= LOGGED OUT =================
            <>
              {/* Login */}
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

              {/* Sign Up */}
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

      {/* ================= MAIN CONTENT ================= */}
      <main className="lg:ml-64">

        {/* Hero Section */}
        <Hero />

        {/* Features Section */}
        <Features />

        {/* How It Works */}
        <HowItWorks />

        {/* CTA Section */}
        <CTASection />

      </main>

    </div>
  );
}

export default Home;
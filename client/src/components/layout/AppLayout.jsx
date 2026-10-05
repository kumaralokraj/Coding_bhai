import { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import MobileSidebar from "./MobileSidebar";

function AppLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Mobile Sidebar */}
      <MobileSidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Mobile Header */}
      <header className="sticky top-0 z-40 flex h-16 items-center border-b border-slate-800 bg-slate-950/95 px-5 backdrop-blur lg:hidden">

        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="rounded-lg border border-slate-700 px-3 py-1.5 text-xl"
        >
          ☰
        </button>

        <h1 className="ml-3 text-xl font-bold">
          Coding<span className="text-cyan-400">Bhai</span>
        </h1>

      </header>

      {/* Page Content */}
      <main className="min-h-screen lg:ml-64">
        <Outlet />
      </main>

    </div>
  );
}

export default AppLayout;
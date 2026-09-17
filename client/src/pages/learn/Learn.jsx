import { useState } from "react";
import Sidebar from "../../components/layout/Sidebar";
import MobileSidebar from "../../components/layout/MobileSidebar";

function Learn() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Sidebar />
      <MobileSidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      <header className="flex h-16 items-center justify-between border-b border-slate-800 px-5 lg:hidden">
        <h1 className="text-xl font-bold">
          Coding<span className="text-cyan-400">Bhai</span>
        </h1>
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="rounded-lg border border-slate-700 px-3 py-2 text-xl"
        >
          ☰
        </button>
      </header>

      <main className="px-4 py-8 lg:ml-64">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-4xl font-bold mb-8">Learn</h1>
          <p className="text-slate-400">Learn content coming soon...</p>
        </div>
      </main>
    </div>
  );
}

export default Learn;

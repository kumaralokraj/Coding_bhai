import { useState } from "react";
import Sidebar from "../../components/layout/Sidebar";
import MobileSidebar from "../../components/layout/MobileSidebar";

function InterviewSetup() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Sidebar />
      <MobileSidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      

      <main className="px-4 py-8 lg:ml-64">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-4xl font-bold mb-8">Setup Interview</h1>
          <p className="text-slate-400">Interview setup content coming soon...</p>
        </div>
      </main>
    </div>
  );
}

export default InterviewSetup;

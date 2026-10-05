import { useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../../components/layout/Sidebar";
import MobileSidebar from "../../components/layout/MobileSidebar";

function InterviewResult() {
  const { id } = useParams();
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
          <h1 className="text-4xl font-bold mb-8">Interview Result {id}</h1>
          <p className="text-slate-400">Interview result content coming soon...</p>
        </div>
      </main>
    </div>
  );
}

export default InterviewResult;

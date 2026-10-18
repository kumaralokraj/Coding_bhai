
import { NavLink } from "react-router-dom";
import { navigationItems } from "../../data/navigation";

function MobileSidebar({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-40 bg-black/60 lg:hidden"
      />

      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-50 flex h-screen w-72 flex-col bg-slate-950 text-white lg:hidden">

        {/* Header */}
        <div className="flex h-20 shrink-0 items-center justify-between border-b border-slate-800 px-5">
          <div>
            <h1 className="text-xl font-bold">
              Coding<span className="text-cyan-400">Bhai</span>
            </h1>

            <p className="text-xs text-slate-500">
              Code. Break. Debug. Learn.
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-2xl text-slate-400 hover:text-white"
            aria-label="Close sidebar"
          >
            ×
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2 overflow-y-auto p-4">
          {navigationItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium ${
                  isActive
                    ? "bg-cyan-500/10 text-cyan-400"
                    : "text-slate-400 hover:bg-slate-900 hover:text-white"
                }`
              }
            >
              <span>{item.icon}</span>
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* AI Mentor — inside sidebar */}
        <div className="shrink-0 border-t border-slate-800 p-4">
          <NavLink
            to="/ai-mentor"
            onClick={onClose}
            className={({ isActive }) =>
              `block rounded-xl border p-4 transition ${
                isActive
                  ? "border-cyan-500/30 bg-cyan-500/10"
                  : "border-transparent bg-slate-900 hover:bg-slate-800"
              }`
            }
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10 text-xl">
                🤖
              </div>

              <div>
                <p className="text-sm font-semibold text-white">
                  AI Mentor
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Get help while coding
                </p>
              </div>
            </div>
          </NavLink>
        </div>
      </aside>
    </>
  );
}

export default MobileSidebar;

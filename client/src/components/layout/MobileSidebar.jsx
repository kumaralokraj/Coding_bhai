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
      <aside className="fixed left-0 top-0 z-50 h-screen w-72 bg-slate-950 text-white lg:hidden">
        
        {/* Header */}
        <div className="flex h-20 items-center justify-between border-b border-slate-800 px-5">
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
          >
            ×
          </button>
        </div>

        {/* Navigation */}
        <nav className="space-y-2 p-4">
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
      </aside>
    </>
  );
}

export default MobileSidebar;
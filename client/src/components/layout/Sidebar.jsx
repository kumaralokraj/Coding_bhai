
import { NavLink } from "react-router-dom";
import { navigationItems } from "../../data/navigation";

function Sidebar() {
  return (
    <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-64 flex-col border-r border-slate-800 bg-slate-950 text-white">
      
      {/* Logo */}
      <div className="flex h-20 items-center border-b border-slate-800 px-6">
        <div>
          <h1 className="text-2xl font-bold">
            Coding<span className="text-cyan-400">Bhai</span>
          </h1>

          <p className="text-xs text-slate-500">
            Code. Break. Debug. Learn.
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 p-4">
        {navigationItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
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

      {/* Bottom */}
      {/* Bottom - AI Mentor */}
<div className="border-t border-slate-800 p-4">
  <NavLink
    to="/ai-mentor"
    className={({ isActive }) =>
      `block rounded-xl p-4 transition ${
        isActive
          ? "border border-cyan-500/30 bg-cyan-500/10"
          : "bg-slate-900 hover:bg-slate-800"
      }`
    }
  >
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/10 text-xl">
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
  );
}

export default Sidebar;

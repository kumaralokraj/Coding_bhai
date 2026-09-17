// import { NavLink } from "react-router-dom";

// const menuItems = [
//   { name: "Home", path: "/" },
//   { name: "Problems", path: "/problems" },
//   { name: "Learn", path: "/learn" },
//   { name: "Interview", path: "/interview" },
//   { name: "Contests", path: "/contests" },
//   { name: "Leaderboard", path: "/leaderboard" },
// ];

// const bottomItems = [
//   { name: "Profile", path: "/profile" },
//   { name: "Settings", path: "/settings" },
// ];

// function Sidebar() {
//   return (
//     <aside className="fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-slate-800 bg-slate-950 text-white">
      
//       {/* Logo */}
//       <div className="flex h-20 items-center border-b border-slate-800 px-6">
//         <div className="flex items-center gap-3">
//           <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 font-bold text-lg">
//             CB
//           </div>

//           <div>
//             <h1 className="text-lg font-bold">CodingBhai</h1>
//             <p className="text-xs text-slate-500">Code. Learn. Grow.</p>
//           </div>
//         </div>
//       </div>

//       {/* Main Navigation */}
//       <nav className="flex-1 px-4 py-6">
//         <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
//           Platform
//         </p>

//         <div className="space-y-1">
//           {menuItems.map((item) => (
//             <NavLink
//               key={item.name}
//               to={item.path}
//               className={({ isActive }) =>
//                 `block rounded-lg px-4 py-3 text-sm font-medium transition ${
//                   isActive
//                     ? "bg-blue-600 text-white"
//                     : "text-slate-400 hover:bg-slate-900 hover:text-white"
//                 }`
//               }
//             >
//               {item.name}
//             </NavLink>
//           ))}
//         </div>

//         {/* Workspace */}
//         <div className="mt-8">
//           <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
//             Workspace
//           </p>

//           <div className="space-y-1">
//             <NavLink
//               to="/progress"
//               className={({ isActive }) =>
//                 `block rounded-lg px-4 py-3 text-sm font-medium transition ${
//                   isActive
//                     ? "bg-blue-600 text-white"
//                     : "text-slate-400 hover:bg-slate-900 hover:text-white"
//                 }`
//               }
//             >
//               Progress
//             </NavLink>
//           </div>
//         </div>
//       </nav>

//       {/* Bottom Navigation */}
//       <div className="border-t border-slate-800 p-4">
//         <div className="space-y-1">
//           {bottomItems.map((item) => (
//             <NavLink
//               key={item.name}
//               to={item.path}
//               className={({ isActive }) =>
//                 `block rounded-lg px-4 py-3 text-sm font-medium transition ${
//                   isActive
//                     ? "bg-blue-600 text-white"
//                     : "text-slate-400 hover:bg-slate-900 hover:text-white"
//                 }`
//               }
//             >
//               {item.name}
//             </NavLink>
//           ))}
//         </div>
//       </div>
//     </aside>
//   );
// }

// export default Sidebar;/
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
      <div className="border-t border-slate-800 p-4">
        <div className="rounded-xl bg-slate-900 p-4">
          <p className="text-sm font-semibold text-white">
            AI Mentor 🤖
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Get help while coding
          </p>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;

import {
  Home,
  Users,
  FileText,
  Mic,
  LogOut,
  LayoutDashboard,
  Settings,
  ScanLine,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const Sidebar = ({ activeLink }: { activeLink: string }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const navLinks = [
    { to: "/dashboard", label: "Dashboard", icon: Home, key: "home" },
    { to: "/visitors", label: "Visitors", icon: Users, key: "visitors" },
    { to: "/scan", label: "Scan", icon: ScanLine, key: "scan" },
  ];

  const toolLinks = [
    { to: "#", label: "Audio Transcripts", icon: Mic, key: "audio" },
    { to: "#", label: "Reports", icon: FileText, key: "reports" },
  ];

  const accountLinks = [
    { to: "/settings", label: "Settings", icon: Settings, key: "settings" },
  ];

  return (
    <aside
      className={`min-h-screen flex flex-col bg-gray-900 text-gray-400 shadow-xl transition-all duration-300 ${
        isCollapsed ? "w-20" : "w-64"
      } hidden md:flex`}
    >
      {/* Sidebar Header */}
      <div className="p-4 text-white flex items-center justify-between border-b border-gray-700">
        <div
          className={`flex items-center gap-2 ${
            isCollapsed ? "justify-center w-full" : ""
          }`}
        >
          <LayoutDashboard className="w-8 h-8 text-blue-500 flex-shrink-0" />
          <span
            className={`text-2xl font-extrabold tracking-wide ${
              isCollapsed ? "hidden" : "block"
            }`}
          >
            Exhibitor
          </span>
        </div>
        <button
          onClick={toggleSidebar}
          className="text-gray-400 hover:text-white transition-colors"
        >
          {isCollapsed ? (
            <ChevronRight className="w-6 h-6" />
          ) : (
            <ChevronLeft className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 mt-8 space-y-2 px-4">
        {!isCollapsed && (
          <h2 className="text-xs font-semibold uppercase text-gray-500 px-2 mb-4">
            Main Menu
          </h2>
        )}

        {navLinks.map((link) => (
          <Link
            key={link.key}
            to={link.to}
            className={`flex items-center gap-4 p-2 rounded-md transition-colors duration-200 ${
              activeLink === link.key
                ? "bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold shadow-md"
                : "hover:bg-gray-800 hover:text-gray-200"
            } ${isCollapsed ? "justify-center" : ""}`}
          >
            <link.icon className="w-5 h-5 flex-shrink-0" />
            <span
              className={`text-lg transition-all duration-200 whitespace-nowrap ${
                isCollapsed ? "hidden" : "block"
              }`}
            >
              {link.label}
            </span>
          </Link>
        ))}

        {!isCollapsed && (
          <h2 className="text-xs font-semibold uppercase text-gray-500 px-2 mt-8 mb-4">
            Tools & Reports
          </h2>
        )}

        {toolLinks.map((link) => (
          <a
            key={link.key}
            href={link.to}
            className={`flex items-center gap-4 p-2 rounded-md transition-colors duration-200 ${
              activeLink === link.key
                ? "bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold shadow-md"
                : "hover:bg-gray-800 hover:text-gray-200"
            } ${isCollapsed ? "justify-center" : ""}`}
          >
            <link.icon className="w-5 h-5 flex-shrink-0" />
            <span
              className={`text-lg transition-all duration-200 whitespace-nowrap ${
                isCollapsed ? "hidden" : "block"
              }`}
            >
              {link.label}
            </span>
          </a>
        ))}
      </nav>

      {/* Account and Logout Section */}
      <div className="mt-auto px-4 py-6 border-t border-gray-700">
        {!isCollapsed && (
          <h2 className="text-xs font-semibold uppercase text-gray-500 px-2 mb-4">
            Account
          </h2>
        )}
        {accountLinks.map((link) => (
          <a
            key={link.key}
            href={link.to}
            className={`flex items-center gap-4 p-2 rounded-md transition-colors duration-200 ${
              activeLink === link.key
                ? "bg-gray-800 text-white font-semibold"
                : "hover:bg-gray-800 hover:text-gray-200"
            } ${isCollapsed ? "justify-center" : ""}`}
          >
            <link.icon className="w-5 h-5 flex-shrink-0" />
            <span
              className={`text-lg transition-all duration-200 whitespace-nowrap ${
                isCollapsed ? "hidden" : "block"
              }`}
            >
              {link.label}
            </span>
          </a>
        ))}

        {/* Logout Button */}
        <Link
          to="/"
          className={`mt-2 flex items-center gap-4 p-2 rounded-md transition-colors duration-200 text-red-400 hover:bg-red-900 hover:text-red-300 font-semibold ${
            isCollapsed ? "justify-center" : ""
          }`}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && (
            <span className="text-lg whitespace-nowrap">Logout</span>
          )}
          {!isCollapsed && (
            <ChevronRight className="w-4 h-4 ml-auto flex-shrink-0" />
          )}
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;

import Sidebar from "../../components/Sidebar";
import { useState, type ReactNode } from "react";
import { Menu } from "lucide-react";

interface LayoutProps {
  children: ReactNode;
  activeLink: string;
}

const DashboardLayout = ({ children, activeLink }: LayoutProps) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="flex h-screen text-gray-800">
      {/* Sidebar is fixed */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="fixed top-0 right-0 md:hidden p-2 text-gray-400 hover:text-white"
      >
        <Menu className="w-6 h-6" />
      </button>
      <Sidebar activeLink={activeLink} isMobileOpen={isMobileOpen} />

      {/* Main content is scrollable */}
      <main className="flex-1 overflow-y-auto bg-gradient-to-tr from-blue-100 via-purple-100 to-pink-100">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;

import Sidebar from "../../components/Sidebar";
import type { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
  activeLink: string;
}

const DashboardLayout = ({ children, activeLink }: LayoutProps) => {
  return (
    <div className="flex h-screen text-gray-800">
      {/* Sidebar is fixed */}
      <Sidebar activeLink={activeLink} />

      {/* Main content is scrollable */}
      <main className="flex-1 overflow-y-auto bg-gradient-to-tr from-blue-100 via-purple-100 to-pink-100">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;

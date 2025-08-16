import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm backdrop-blur bg-opacity-80">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
        <a href="#hero" className="text-2xl font-bold text-indigo-600">
          🎴 UCR
        </a>
        <nav className="space-x-6 text-sm font-medium text-gray-700 hidden md:block">
          <a href="#features" className="hover:text-indigo-600">
            Features
          </a>
          <a href="#cta" className="hover:text-indigo-600">
            Get Started
          </a>
        </nav>
      </div>
    </header>
  );
}

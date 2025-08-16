import { useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../dashboard/DashboardLayout";
import {
  User,
  Bell,
  Settings,
  ArrowRight,
  CreditCard,
  LogOut,
} from "lucide-react";

// Toggle Switch Component
const ToggleSwitch = ({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: () => void;
}) => (
  <label className="flex items-center cursor-pointer">
    <div className="relative">
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={onChange}
      />
      <div
        className={`block w-14 h-8 rounded-full ${
          checked ? "bg-indigo-600" : "bg-gray-200"
        }`}
      ></div>
      <div
        className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform duration-300 ${
          checked ? "translate-x-6" : "translate-x-0"
        }`}
      ></div>
    </div>
  </label>
);

export default function SettingsPage() {
  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("john.doe@example.com");
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
  });

  const handleSaveProfile = (e: React.SyntheticEvent) => {
    e.preventDefault();
    // Logic to save profile data to the backend
    console.log("Saving profile:", { name, email });
    alert("Profile saved successfully!");
  };

  return (
    <DashboardLayout activeLink="settings">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-12">
        {/* Header */}
        <header className="text-center">
          <h1 className="text-4xl font-extrabold text-indigo-700 flex items-center justify-center gap-2">
            <Settings className="w-8 h-8" />
            Settings
          </h1>
        </header>

        {/* Profile Settings Section */}
        <section className="bg-white shadow-lg rounded-xl p-6 border border-gray-100 space-y-6">
          <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 flex items-center gap-2">
            <User className="w-5 h-5 text-indigo-600" />
            Profile Information
          </h2>
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div className="pt-2">
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                Save Profile
              </button>
            </div>
          </form>
        </section>

        {/* Notification Settings Section */}
        <section className="bg-white shadow-lg rounded-xl p-6 border border-gray-100 space-y-6">
          <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 flex items-center gap-2">
            <Bell className="w-5 h-5 text-indigo-600" />
            Notification Settings
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                Email Notifications
              </span>
              <ToggleSwitch
                checked={notifications.email}
                onChange={() =>
                  setNotifications({
                    ...notifications,
                    email: !notifications.email,
                  })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                Push Notifications
              </span>
              <ToggleSwitch
                checked={notifications.push}
                onChange={() =>
                  setNotifications({
                    ...notifications,
                    push: !notifications.push,
                  })
                }
              />
            </div>
          </div>
        </section>

        {/* Account and Billing Section */}
        <section className="bg-white shadow-lg rounded-xl p-6 border border-gray-100 space-y-6">
          <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-indigo-600" />
            Account & Billing
          </h2>
          <div className="space-y-4">
            <Link
              to="#"
              className="flex justify-between items-center px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <span className="text-sm font-medium text-gray-700">
                Manage Subscription
              </span>
              <ArrowRight className="w-4 h-4 text-gray-400" />
            </Link>
            <Link
              to="#"
              className="flex justify-between items-center px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <span className="text-sm font-medium text-gray-700">
                Payment History
              </span>
              <ArrowRight className="w-4 h-4 text-gray-400" />
            </Link>
          </div>
          <div className="pt-4 border-t border-gray-200">
            <button
              onClick={() => alert("Logging out...")}
              className="w-full text-left flex items-center justify-between text-sm font-medium text-red-600 hover:text-red-800 transition-colors"
            >
              <span className="flex items-center gap-2">
                <LogOut className="w-4 h-4" />
                Logout
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  Users,
  RefreshCw,
  XCircle,
  User,
  Building,
  CheckCircle,
  Clock,
} from "lucide-react";
import DashboardLayout from "./DashboardLayout";

interface Visitor {
  _id: string;
  name: string;
  email: string;
  company: string;
  mobile: string;
  createdAt?: string;
}

const formatTimeAgo = (dateString?: string): string => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutes ago";
  return "just now";
};

// --- Enhanced Skeleton ---
const TableSkeleton = () => (
  <div className="animate-pulse space-y-4">
    <div className="h-10 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-lg"></div>
    {[...Array(5)].map((_, i) => (
      <div
        key={i}
        className="grid grid-cols-5 gap-4 h-10 bg-white rounded-lg shadow-sm p-2"
      >
        {[...Array(5)].map((__, idx) => (
          <div key={idx} className="bg-gray-200 h-6 rounded-full"></div>
        ))}
      </div>
    ))}
  </div>
);

export default function VisitorListPage() {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchVisitors();
  }, []);

  const fetchVisitors = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.get("http://localhost:5000/api/visitor");
      setVisitors(res.data as Visitor[]);
    } catch (err) {
      console.error(err);
      setError(
        "Failed to load visitors. Please check your network and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout activeLink="visitors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 flex items-center gap-3">
            <Users className="w-8 h-8 text-blue-500" />
            Visitor List
          </h1>
          <button
            onClick={fetchVisitors}
            disabled={loading}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg hover:scale-105 transition-all duration-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-md"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <TableSkeleton />
        ) : error ? (
          <div
            className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md flex items-center justify-between shadow-sm"
            role="alert"
          >
            <div className="flex items-center gap-3">
              <XCircle className="w-5 h-5" />
              <p className="font-medium">{error}</p>
            </div>
            <button
              onClick={() => setError("")}
              className="text-red-500 hover:text-red-700 font-bold"
            >
              ×
            </button>
          </div>
        ) : visitors.length === 0 ? (
          <div className="text-center p-10 bg-white rounded-lg shadow-sm border border-gray-200">
            <p className="text-xl font-semibold text-gray-500">
              No visitors found.
            </p>
            <p className="text-gray-400 mt-2">
              Start scanning business cards to see your visitor list here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {[
                    "Name",
                    "Company",
                    "Status",
                    "Last Interaction",
                    "Actions",
                  ].map((header) => (
                    <th
                      key={header}
                      className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {visitors.map((v) => (
                  <tr
                    key={v._id}
                    className="hover:bg-blue-50 transition-all duration-200"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-blue-500" />
                        {v.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4 text-gray-500" />
                        {v.company}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 flex items-center gap-1 shadow-sm">
                        <CheckCircle className="w-3 h-3" />
                        Followed Up
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        {formatTimeAgo(v.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link
                        to={`/visitor/${v._id}`}
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                      >
                        View Profile
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

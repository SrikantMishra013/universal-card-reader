import DashboardLayout from "./DashboardLayout";
import { ScanLine, User, CheckCircle, TrendingUp, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import CountUp from "react-countup";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

// Sample data for the charts
const visitorsData = [
  { name: "Day 1", visitors: 40 },
  { name: "Day 2", visitors: 30 },
  { name: "Day 3", visitors: 55 },
  { name: "Day 4", visitors: 48 },
  { name: "Day 5", visitors: 62 },
  { name: "Day 6", visitors: 70 },
  { name: "Day 7", visitors: 65 },
];

const leadSourceData = [
  { name: "Trade Show", value: 150 },
  { name: "Website", value: 80 },
  { name: "Referral", value: 50 },
  { name: "Social Media", value: 30 },
];
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const DashboardPage = () => {
  return (
    <DashboardLayout activeLink="home">
      <div className="space-y-10 p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
        {/* Header and User Greeting */}
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 tracking-tight">
            Hello, Exhibitor!
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-600 hidden md:block">
              John Doe
            </span>
            <img
              src="https://i.pravatar.cc/40?u=johndoe"
              alt="User Avatar"
              className="w-12 h-12 rounded-full border-2 border-blue-500 shadow-sm"
            />
          </div>
        </div>

        {/* Quick Actions and Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border-t-4 border-blue-500 flex flex-col justify-between lg:col-span-1 hover:shadow-2xl transition-all">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Quick Actions
              </h2>
              <Link
                to="/scan"
                className="text-blue-500 hover:text-blue-700 transition-colors"
              >
                View all
              </Link>
            </div>
            <Link
              to="/scan"
              className="bg-gradient-to-r from-blue-500 to-blue-700 text-white flex items-center justify-center gap-3 p-4 rounded-lg text-lg font-semibold hover:scale-105 transition-transform shadow-md animate-pulse"
            >
              <ScanLine className="w-6 h-6" />
              Scan a New Visitor
            </Link>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:col-span-2">
            {[
              {
                title: "Total Visitors Scanned",
                value: 247,
                icon: <User className="text-purple-500 w-8 h-8" />,
                color: "purple",
              },
              {
                title: "Follow-ups Completed",
                value: 189,
                icon: <CheckCircle className="text-green-500 w-8 h-8" />,
                color: "green",
              },
              {
                title: "Leads This Week",
                value: 72,
                icon: <TrendingUp className="text-yellow-500 w-8 h-8" />,
                color: "yellow",
              },
              {
                title: "Pending Follow-ups",
                value: 58,
                icon: <Mail className="text-red-500 w-8 h-8" />,
                color: "red",
              },
            ].map((kpi, idx) => (
              <div
                key={idx}
                className={`bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all border-l-4 border-${kpi.color}-500`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-600">
                    {kpi.title}
                  </h3>
                  {kpi.icon}
                </div>
                <p className={`text-4xl font-extrabold text-${kpi.color}-600`}>
                  <CountUp end={kpi.value} duration={1.5} separator="," />
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Performance & Trends Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Visitor Trends
            </h2>
            <p className="text-gray-600 mb-6">Activity over the past 7 days.</p>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={visitorsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="visitors"
                  stroke="#2563eb"
                  strokeWidth={3}
                  dot={{
                    r: 5,
                    fill: "#2563eb",
                    stroke: "#fff",
                    strokeWidth: 2,
                  }}
                  activeDot={{ r: 8, fill: "#1e40af" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Lead Source Breakdown
            </h2>
            <p className="text-gray-600 mb-6">
              Where your leads are coming from.
            </p>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={leadSourceData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name}: ${(percent! * 100).toFixed(0)}%`
                  }
                >
                  {leadSourceData.map((_entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Visitors Table */}
        <div className="mt-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Recent Visitors
            </h2>
            <Link
              to="/visitors"
              className="text-blue-500 hover:text-blue-700 font-medium transition-colors"
            >
              View all visitors
            </Link>
          </div>
          <div className="overflow-x-auto bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all">
            <table className="min-w-full text-left">
              <thead className="bg-blue-50 text-gray-700 uppercase text-sm font-semibold">
                <tr>
                  <th className="px-6 py-4">Visitor</th>
                  <th className="px-6 py-4">Company</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Last Interaction</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {[
                  {
                    name: "Ava Carter",
                    avatar: "avacarter",
                    company: "Skyline Ventures",
                    status: "Followed Up",
                    statusColor: "green",
                    icon: <CheckCircle className="w-4 h-4" />,
                    time: "2 hours ago",
                    id: 1,
                  },
                  {
                    name: "Liam Zhang",
                    avatar: "liamzhang",
                    company: "TechNova",
                    status: "Pending Follow-up",
                    statusColor: "yellow",
                    icon: <Mail className="w-4 h-4" />,
                    time: "5 hours ago",
                    id: 2,
                  },
                  {
                    name: "Sarah Jones",
                    avatar: "sarahjones",
                    company: "Innovate Solutions",
                    status: "Followed Up",
                    statusColor: "green",
                    icon: <CheckCircle className="w-4 h-4" />,
                    time: "1 day ago",
                    id: 3,
                  },
                ].map((visitor, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <img
                          src={`https://i.pravatar.cc/40?u=${visitor.avatar}`}
                          alt={`${visitor.name} Avatar`}
                          className="w-10 h-10 rounded-full"
                        />
                        <span className="font-medium text-gray-900">
                          {visitor.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                      {visitor.company}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-2 bg-${visitor.statusColor}-100 text-${visitor.statusColor}-800 text-xs font-semibold px-3 py-1 rounded-full shadow-sm`}
                      >
                        {visitor.icon}
                        {visitor.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {visitor.time}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <Link
                        to={`/visitor/${visitor.id}`}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        View Profile
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import DashboardMain from "./pages/dashboard/DashboardMain";
import ScanPage from "./pages/dashboard/ScanPage";
import VisitorsPage from "./pages/dashboard/VisitorsPage";
import VisitorDetailsPage from "./pages/dashboard/VisitorDetailsPage";
import SettingsPage from "./pages/dashboard/SettingsPage";
import SignUpPage from "./pages/signUpPage";
// import ToastContainer from "./components/Toast";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<DashboardMain />} />
        <Route path="/scan" element={<ScanPage />} />
        <Route path="/visitors" element={<VisitorsPage />} />
        <Route path="visitor/:id" element={<VisitorDetailsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/signup" element={<SignUpPage />} />
      </Routes>
      {/* <ToastContainer /> */}
    </Router>
  );
}

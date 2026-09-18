import {
  LayoutDashboard,
  Brain,
  Cloud,
  Bell,
  User,
  LogOut
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Sidebar() {

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {

    logout();

    navigate("/login");
  };

  return (
    <aside className="sidebar">

      <div className="sidebar-logo">
        🌱
        <span>AgriCloud</span>
      </div>

      <nav>

        <NavLink
          to={user?.role === "ADMIN" ? "/admin" : "/farmer"}
          className="nav-item"
        >
          <LayoutDashboard size={20} />
          Dashboard
        </NavLink>

        <NavLink
          to="/predictions"
          className="nav-item"
        >
          <Brain size={20} />
          AI Predictions
        </NavLink>

        <NavLink
          to="/resources"
          className="nav-item"
        >
          <Cloud size={20} />
          Cloud Resources
        </NavLink>

        <NavLink
          to="/alerts"
          className="nav-item"
        >
          <Bell size={20} />
          Alerts
        </NavLink>

        <NavLink
          to="/profile"
          className="nav-item"
        >
          <User size={20} />
          Profile
        </NavLink>

      </nav>

      <button
        className="logout-button"
        onClick={handleLogout}
      >
        <LogOut size={20} />
        Logout
      </button>

    </aside>
  );
}

export default Sidebar;
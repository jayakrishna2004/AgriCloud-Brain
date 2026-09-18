import { Bell, UserCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {

  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <header className="navbar">

      <div className="navbar-title">
        AgriCloud-Brain
      </div>

      <div className="navbar-actions">

        <button
          className="icon-button"
          onClick={() => navigate("/alerts")}
        >
          <Bell size={20} />
        </button>

        <button
          className="profile-button"
          onClick={() => navigate("/profile")}
        >
          <UserCircle size={25} />

          <span>
            {user?.name || "User"}
          </span>
        </button>

      </div>

    </header>
  );
}

export default Navbar;
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import { useAuth } from "../context/AuthContext";

function Profile() {

  const { user } = useAuth();

  return (
    <div className="dashboard-layout">

      <Sidebar />

      <div className="dashboard-main">

        <Navbar />

        <main className="dashboard-content">

          <div className="page-heading">

            <h1>Profile</h1>

            <p>
              Manage your AgriCloud-Brain account.
            </p>

          </div>

          <div className="profile-card">

            <div className="profile-avatar">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>

            <h2>
              {user?.name || "User"}
            </h2>

            <p>
              {user?.email || "user@example.com"}
            </p>

            <span className="role-badge">
              {user?.role || "FARMER"}
            </span>

          </div>

        </main>

      </div>

    </div>
  );
}

export default Profile;
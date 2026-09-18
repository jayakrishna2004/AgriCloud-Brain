import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import AlertCard from "../components/AlertCard";

function Alerts() {

  return (
    <div className="dashboard-layout">

      <Sidebar />

      <div className="dashboard-main">

        <Navbar />

        <main className="dashboard-content">

          <div className="page-heading">

            <h1>Alerts</h1>

            <p>
              Cloud infrastructure and AI scaling alerts.
            </p>

          </div>

          <AlertCard
            title="High Workload Predicted"
            message="AI model predicts workload above 70% in the next period."
            severity="critical"
            time="10 minutes ago"
          />

          <AlertCard
            title="Auto Scaling Triggered"
            message="Backend instances increased from 3 to 4."
            severity="warning"
            time="25 minutes ago"
          />

          <AlertCard
            title="System Healthy"
            message="All major services are operating normally."
            severity="success"
            time="1 hour ago"
          />

        </main>

      </div>

    </div>
  );
}

export default Alerts;
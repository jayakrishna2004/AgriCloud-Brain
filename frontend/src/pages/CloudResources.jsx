import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import ResourceCard from "../components/ResourceCard";
import CPUChart from "../charts/CPUChart";
import MemoryChart from "../charts/MemoryChart";

function CloudResources() {

  return (
    <div className="dashboard-layout">

      <Sidebar />

      <div className="dashboard-main">

        <Navbar />

        <main className="dashboard-content">

          <div className="page-heading">

            <h1>Cloud Resources</h1>

            <p>
              Current AWS/Kubernetes resource status.
            </p>

          </div>

          <div className="resource-list">

            <ResourceCard
              name="Backend Service"
              status="healthy"
              cpu={61}
              memory={58}
              instances={4}
            />

            <ResourceCard
              name="AI Prediction Engine"
              status="healthy"
              cpu={73}
              memory={65}
              instances={3}
            />

            <ResourceCard
              name="Frontend Service"
              status="healthy"
              cpu={35}
              memory={42}
              instances={2}
            />

          </div>

          <div className="dashboard-grid">

            <CPUChart />

            <MemoryChart />

          </div>

        </main>

      </div>

    </div>
  );
}

export default CloudResources;
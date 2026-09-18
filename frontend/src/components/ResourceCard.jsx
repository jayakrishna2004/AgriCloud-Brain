import { Server } from "lucide-react";

function ResourceCard({
  name,
  status,
  cpu,
  memory,
  instances
}) {

  return (
    <div className="resource-card">

      <div className="resource-title">

        <Server size={22} />

        <div>
          <h3>{name}</h3>

          <span className={`status ${status}`}>
            {status}
          </span>
        </div>

      </div>

      <div className="resource-info">

        <div>
          <span>CPU</span>
          <strong>{cpu}%</strong>
        </div>

        <div>
          <span>Memory</span>
          <strong>{memory}%</strong>
        </div>

        <div>
          <span>Instances</span>
          <strong>{instances}</strong>
        </div>

      </div>

    </div>
  );
}

export default ResourceCard;
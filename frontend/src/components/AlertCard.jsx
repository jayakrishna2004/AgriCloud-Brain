import {
  AlertTriangle,
  CheckCircle
} from "lucide-react";

function AlertCard({
  title,
  message,
  severity,
  time
}) {

  const isCritical = severity === "critical";

  return (
    <div className={`alert-card ${severity}`}>

      <div className="alert-icon">

        {isCritical ? (
          <AlertTriangle size={22} />
        ) : (
          <CheckCircle size={22} />
        )}

      </div>

      <div className="alert-content">

        <h3>{title}</h3>

        <p>{message}</p>

        <small>{time}</small>

      </div>

    </div>
  );
}

export default AlertCard;
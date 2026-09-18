function MetricCard({
  title,
  value,
  unit,
  icon,
  description
}) {

  return (
    <div className="metric-card">

      <div className="metric-header">

        <span>
          {title}
        </span>

        <span className="metric-icon">
          {icon}
        </span>

      </div>

      <div className="metric-value">

        {value}

        {unit && (
          <small>{unit}</small>
        )}

      </div>

      {description && (
        <div className="metric-description">
          {description}
        </div>
      )}

    </div>
  );
}

export default MetricCard;
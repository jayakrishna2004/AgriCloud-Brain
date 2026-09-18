import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";

const data = [
  { time: "10:00", actual: 45, predicted: 48 },
  { time: "12:00", actual: 55, predicted: 58 },
  { time: "14:00", actual: 70, predicted: 74 },
  { time: "16:00", actual: 65, predicted: 68 },
  { time: "18:00", actual: 52, predicted: 55 },
  { time: "20:00", actual: null, predicted: 48 }
];

function PredictionChart() {

  return (
    <div className="chart-container">

      <h3>Actual vs Predicted Workload</h3>

      <ResponsiveContainer width="100%" height={320}>

        <LineChart data={data}>

          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="time" />

          <YAxis />

          <Tooltip />

          <Legend />

          <Line
            type="monotone"
            dataKey="actual"
            strokeWidth={3}
            name="Actual"
          />

          <Line
            type="monotone"
            dataKey="predicted"
            strokeWidth={3}
            strokeDasharray="6 6"
            name="Predicted"
          />

        </LineChart>

      </ResponsiveContainer>

    </div>
  );
}

export default PredictionChart;
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from "recharts";

const data = [
  { time: "08:00", cpu: 30 },
  { time: "10:00", cpu: 42 },
  { time: "12:00", cpu: 58 },
  { time: "14:00", cpu: 70 },
  { time: "16:00", cpu: 65 },
  { time: "18:00", cpu: 50 }
];

function CPUChart() {

  return (
    <div className="chart-container">

      <h3>CPU Utilization</h3>

      <ResponsiveContainer width="100%" height={280}>

        <LineChart data={data}>

          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="time" />

          <YAxis domain={[0, 100]} />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="cpu"
            strokeWidth={3}
          />

        </LineChart>

      </ResponsiveContainer>

    </div>
  );
}

export default CPUChart;
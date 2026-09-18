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
  { time: "08:00", workload: 35 },
  { time: "10:00", workload: 48 },
  { time: "12:00", workload: 62 },
  { time: "14:00", workload: 75 },
  { time: "16:00", workload: 68 },
  { time: "18:00", workload: 52 },
  { time: "20:00", workload: 42 }
];

function WorkloadChart() {

  return (
    <div className="chart-container">

      <h3>Workload Trend</h3>

      <ResponsiveContainer width="100%" height={300}>

        <LineChart data={data}>

          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="time" />

          <YAxis />

          <Tooltip />

          <Legend />

          <Line
            type="monotone"
            dataKey="workload"
            strokeWidth={3}
            name="Workload %"
          />

        </LineChart>

      </ResponsiveContainer>

    </div>
  );
}

export default WorkloadChart;
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from "recharts";

const data = [
  { name: "Backend", instances: 4 },
  { name: "AI Engine", instances: 3 },
  { name: "Frontend", instances: 2 }
];

function ResourceChart() {

  return (
    <div className="chart-container">

      <h3>Active Instances</h3>

      <ResponsiveContainer width="100%" height={280}>

        <BarChart data={data}>

          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="name" />

          <YAxis />

          <Tooltip />

          <Bar
            dataKey="instances"
          />

        </BarChart>

      </ResponsiveContainer>

    </div>
  );
}

export default ResourceChart;
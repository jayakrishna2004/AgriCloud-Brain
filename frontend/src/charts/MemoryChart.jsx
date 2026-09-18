import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from "recharts";

const data = [
  { time: "08:00", memory: 40 },
  { time: "10:00", memory: 48 },
  { time: "12:00", memory: 55 },
  { time: "14:00", memory: 68 },
  { time: "16:00", memory: 63 },
  { time: "18:00", memory: 50 }
];

function MemoryChart() {

  return (
    <div className="chart-container">

      <h3>Memory Utilization</h3>

      <ResponsiveContainer width="100%" height={280}>

        <AreaChart data={data}>

          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="time" />

          <YAxis domain={[0, 100]} />

          <Tooltip />

          <Area
            type="monotone"
            dataKey="memory"
            fillOpacity={0.25}
          />

        </AreaChart>

      </ResponsiveContainer>

    </div>
  );
}

export default MemoryChart;
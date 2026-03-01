import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  LineChart, Line, Area, XAxis, YAxis,
  Tooltip, ReferenceLine, ResponsiveContainer,
} from "recharts";

export default function ReusableGraph({patientID, apiURL, config}) {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      try {
        const res = await fetch(`${apiURL}${patientID}`);
        if (!res.ok) throw new Error("Network error");

        const raw = await res.json();

        const formatted = Object.entries(raw)
          .map(([date, value]) => ({ date, [config.dataKey]: value }))
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .filter((v, i, arr) => i === 0 || arr[i - 1].date !== v.date);

        if (!cancelled) setData(formatted);
      } catch (err) {
        console.error("Fetch error:", err);
        if (!cancelled) setData([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchData();
    return () => { cancelled = true };
  }, []);

  const getColor = (value) => {
    if (value >= config.thresholds.high) return "#ef4444";
    if (value >= config.thresholds.elevated) return "#22c55e";
    return "#38bdf8";
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  if (loading) return <div style={{ color: "#94a3b8", fontFamily: "'Inter', sans-serif" }}>Loading...</div>;
  if (!data.length) return <div style={{ color: "#94a3b8", fontFamily: "'Inter', sans-serif" }}>No data available.</div>;

  const values = data.map(d => d[config.dataKey]);
  const avg = Math.round(values.reduce((a, b) => a + b, 0) / values.length);
  const max = Math.max(...values);
  const min = Math.min(...values);

  const formattedData = data.map(d => ({
    ...d,
    displayDate: formatDate(d.date),
  }));

  return (
    <div style={{
      background: "#171718",
      borderRadius: "12px",
      padding: "40px 20px",
      fontFamily: "'Inter', sans-serif",
      width: "600px", // fixed width
    }}>
      <h1 style={{ color: "#c7c9ce", marginBottom: "20px", fontWeight: 600, letterSpacing: "0.5px" }}>
        {config.title}
      </h1>

      {/* Stats */}
      <div style={{ display: "flex", gap: "16px", marginBottom: "24px" }}>
        {[
          { label: "Average", value: avg, color: getColor(avg) },
          { label: "Peak", value: max, color: "#ef4444" },
          { label: "Lowest", value: min, color: "#38bdf8" }
        ].map(stat => (
          <div key={stat.label} style={{
            flex: 1,
            background: "#1b1c1f",
            borderRadius: "12px",
            border: "solid 1px #393c3f",
            padding: "16px",
            fontWeight: 500
          }}>
            <p style={{ color: "#c1c1c1", fontSize: "12px", textTransform: "uppercase" }}>{stat.label}</p>
            <p style={{ color: stat.color, fontSize: "26px", margin: 0 }}>
              {stat.value} <span style={{ fontSize: "12px", color: "#afafaf" }}>{config.unit}</span>
            </p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div style={{
        background: "#1b1c1f",
        border: "solid 1px #393c3f",
        borderRadius: "16px",
        padding: "20px"
      }}>
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={formattedData}>
            <defs>
              {/* Line gradient */}
              <linearGradient id="line-gradient" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="45%" stopColor="#22c55e" />
                <stop offset="70%" stopColor="#ef4444" />
              </linearGradient>

              {/* Area gradient */}
              <linearGradient id="area-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.3} />
                <stop offset="60%" stopColor="#22c55e" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#ef4444" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity={0} />
              </linearGradient>
            </defs>

            <XAxis 
              dataKey="displayDate" 
              stroke="#afafaf" 
              tick={{ fontFamily: "'Inter', sans-serif", fontSize: 12 }}
            />
            <YAxis 
              domain={config.yDomain} 
              stroke="#afafaf" 
              tick={{ fontFamily: "'Inter', sans-serif", fontSize: 12 }}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload?.length) {
                  const value = payload[0].value;
                  const color = getColor(value);
                  return (
                    <div style={{
                      border: `1px solid ${color}`,
                      padding: "10px",
                      borderRadius: "8px",
                      fontFamily: "'Inter', sans-serif"
                    }}>
                      <p style={{ color: "#94a3b8", margin: 0 }}>{label}</p>
                      <p style={{ color, fontSize: "18px", margin: 0 }}>
                        {value} {config.unit}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />

            {config.referenceLines.map(ref => (
              <ReferenceLine
                key={ref.value}
                y={ref.value}
                stroke={ref.color}
                strokeDasharray="4 4"
              />
            ))}

            {/* Area under the line */}
            <Area
              type="monotone"
              dataKey={config.dataKey}
              stroke="none"
              fill="url(#area-gradient)"
            />

            {/* Smooth gradient line */}
            <Line
              type="monotone"
              dataKey={config.dataKey}
              stroke="url(#line-gradient)"
              strokeWidth={3}
              dot={({ cx, cy, value }) => (
                <circle
                  cx={cx}
                  cy={cy}
                  r={5}
                  fill={getColor(value)}
                  stroke="#1b1c1f"
                  strokeWidth={2}
                />
              )}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
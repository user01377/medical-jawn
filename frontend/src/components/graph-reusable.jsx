import React, { useEffect, useState } from "react";
import {
  LineChart, Line, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ReferenceLine, ResponsiveContainer,
} from "recharts";

const GET_SYS_DATA = "http://127.0.0.1:8000/get-patient-sys-data/2";

export default function SystolicGraph() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const config = {
    title: "Systolic Blood Pressure",
    dataKey: "systolic",
    unit: "mmHg",
    yDomain: [80, 180],
    thresholds: {
      elevated: 120,
      high: 140,
    },
    referenceLines: [
      { value: 120, label: "Elevated", color: "#22c55e" },
      { value: 140, label: "High", color: "#ef4444" },
    ],
  };

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      try {
        const res = await fetch(GET_SYS_DATA);
        if (!res.ok) throw new Error("Network error");

        const raw = await res.json();

        const formatted = Object.entries(raw)
          .map(([date, value]) => ({ date, systolic: value }))
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

  if (loading) return <div style={{ color: "#94a3b8" }}>Loading...</div>;
  if (!data.length) return <div style={{ color: "#94a3b8" }}>No data available.</div>;

  const values = data.map(d => d.systolic);
  const avg = Math.round(values.reduce((a, b) => a + b, 0) / values.length);
  const max = Math.max(...values);
  const min = Math.min(...values);

  const formattedData = data.map(d => ({
    ...d,
    displayDate: formatDate(d.date),
  }));

  return (
    <div style={{
      minHeight: "100vh",
      padding: "40px 20px",
      fontFamily: "'Georgia', serif",
    }}>
      <div style={{ maxWidth: "860px", margin: "0 auto" }}>
        <h1 style={{ color: "#f8fafc", marginBottom: "20px" }}>{config.title}</h1>

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
              padding: "16px"
            }}>
              <p style={{ color: "#475569", fontSize: "12px" }}>{stat.label}</p>
              <p style={{ color: stat.color, fontSize: "26px", margin: 0 }}>
                {stat.value} <span style={{ fontSize: "12px", color: "#64748b" }}>{config.unit}</span>
              </p>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div style={{
          background: "#1b1c1f",
          borderRadius: "16px",
          padding: "20px"
        }}>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={formattedData}>
              <defs>
                {/* Line gradient: blue → green → red */}
                <linearGradient id="line-gradient" x1="0" y1="1" x2="0" y2="0">
                  <stop offset="0%" stopColor="#38bdf8" />q
                  <stop offset="45%" stopColor="#22c55e" />
                  <stop offset="70%" stopColor="#ef4444" />
                </linearGradient>

                {/* Area under the line */}
                <linearGradient id="area-gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.3} />
                  <stop offset="60%" stopColor="#22c55e" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#38bdf8" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid stroke="#1e293b" strokeDasharray="4 4" vertical={false} />
              <XAxis dataKey="displayDate" stroke="#475569" />
              <YAxis domain={config.yDomain} stroke="#475569" />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload?.length) {
                    const value = payload[0].value;
                    const color = getColor(value);
                    return (
                      <div style={{
                        background: "#1b1c1f",
                        border: `1px solid ${color}`,
                        padding: "10px",
                        borderRadius: "8px"
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
                dataKey="systolic"
                stroke="none"
                fill="url(#area-gradient)"
              />

              {/* Smooth gradient line */}
              <Line
                type="monotone"
                dataKey="systolic"
                stroke="url(#line-gradient)"
                strokeWidth={3}
                dot={({ cx, cy, value}) => (
                  <circle
                    cx={cx}
                    cy={cy}
                    r={5}
                    fill={getColor(value)}
                    stroke="1b1c1f"
                    strokeWidth={2}
                  />
                )}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  LineChart, Line, Area, XAxis, YAxis,
  Tooltip, ReferenceLine, ResponsiveContainer,
} from "recharts";


export default function ReusableGraph({patientID, apiURL, config}) {

  let PREDICT_PRED_DATA;

  if( config.dataKey == 'systolic'){
    PREDICT_PRED_DATA = "http://localhost:8000/predict-patient-sys-data/";
  } else if (config.dataKey == 'diastolic'){
    PREDICT_PRED_DATA = "http://localhost:8000/predict-patient-dia-data/";  
  } else {
    PREDICT_PRED_DATA = "http://localhost:8000/predict-patient-chol-data/";
  }


  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      try {
        // --- Fetch real data ---
        const resReal = await fetch(`${apiURL}${patientID}`);
        const rawReal = await resReal.json();
        const realArray = Object.entries(rawReal)
          .map(([date, value]) => ({ date, [config.dataKey]: Number(value) }))
          .sort((a, b) => new Date(a.date) - new Date(b.date));

        // Get the last real measurement
        const lastRealEntry = realArray[realArray.length - 1];

        // --- Fetch predicted data ---
        const resPred = await fetch(`${PREDICT_PRED_DATA}${patientID}`);
        const rawPred = await resPred.json();

        // Prepend last real entry to prediction
        const predWithStart = { [lastRealEntry.date]: lastRealEntry[config.dataKey], ...rawPred };

        const predArray = Object.entries(predWithStart)
          .map(([date, value]) => ({ date, [config.dataKey]: Number(value) }))
          .sort((a, b) => new Date(a.date) - new Date(b.date));

        // --- Combine both arrays for chart ---
        const allDates = Array.from(
          new Set([...realArray, ...predArray].map(d => d.date))
        ).sort((a, b) => new Date(a) - new Date(b));

        const combined = allDates.map(date => {
          const real = realArray.find(d => d.date === date)?.[config.dataKey] ?? null;
          const predicted = predArray.find(d => d.date === date)?.[config.dataKey] ?? null;
          return { date, [config.dataKey]: real, predicted };
        });

        if (!cancelled) setData(combined);
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

  const values = data.flatMap(d => [d.real, d.predicted].filter(Boolean));
  const avg = Math.round(values.reduce((a, b) => a + b, 0) / values.length);
  const max = Math.max(...values);
  const min = Math.min(...values);

  const formattedData = data.map(d => ({
    ...d,
    displayDate: formatDate(d.date),
  }));

  return (
    <div
      style={{
        height: "480px",
        display: "flex",
        flexDirection: "column",
        padding: "20px",
        fontFamily: "'Georgia', serif",
        background: "#0c0c0c",
        borderRadius: "12px",
        border: "2px solid #1c1c1c"
      }}
    >
      <h1 style={{ color: "#c6cacf", marginBottom: "20px" }}>
        {config.title}
      </h1>
  
      {/* Chart Container */}
      <div
        style={{
          flex: 1,
          background: "#1b1c1f",
          borderRadius: "16px",
          border: "2px solid #2c2c2c",
          padding: "20px",
          display: "flex"
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={formattedData}>
            <defs>
              <linearGradient id="line-gradient" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="45%" stopColor="#22c55e" />
                <stop offset="70%" stopColor="#ef4444" />
              </linearGradient>
  
              <linearGradient id="area-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.3} />
                <stop offset="60%" stopColor="#22c55e" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#ef4444" stopOpacity={0.3} />
              </linearGradient>
            </defs>
  
            <XAxis dataKey="displayDate" stroke="#475569" />
            <YAxis domain={config.yDomain} stroke="#475569" />
  
            <Area
              type="monotone"
              dataKey={config.dataKey}
              stroke="none"
              fill="url(#area-gradient)"
            />
  
            <Line
              type="monotone"
              dataKey={config.dataKey}
              stroke="url(#line-gradient)"
              strokeWidth={3}
              dot={false}
              isAnimationActive={false}
            />
  
            <Line
              type="monotone"
              dataKey="predicted"
              stroke="#a855f7"
              strokeWidth={3}
              dot={false}
              isAnimationActive={false}
              strokeDasharray="4 4"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
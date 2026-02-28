import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ReferenceLine, ResponsiveContainer,
} from "recharts";

const getColor = (value, thresholds) => {
  if (value >= thresholds.high)     return "#ef4444";
  if (value >= thresholds.elevated) return "#22c55e";
  return "#38bdf8";
};

const lerpColor = (colorA, colorB, t) => {
  const parse = (hex) => [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ];
  const [r1, g1, b1] = parse(colorA);
  const [r2, g2, b2] = parse(colorB);
  const r = Math.round(r1 + (r2 - r1) * t);
  const g = Math.round(g1 + (g2 - g1) * t);
  const b = Math.round(b1 + (b2 - b1) * t);
  return `rgb(${r},${g},${b})`;
};

const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const CustomTooltip = ({ active, payload, label, config }) => {
  if (active && payload && payload.length) {
    const value = payload[0].value;
    const color = getColor(value, config.thresholds);
    const status = value >= config.thresholds.high
      ? "High"
      : value >= config.thresholds.elevated
      ? "Normal"
      : "Below Normal";

    return (
      <div style={{
        background: "#0f172a",
        border: `1px solid ${color}`,
        borderRadius: "10px",
        padding: "12px 16px",
        boxShadow: `0 8px 32px ${color}44`,
      }}>
        <p style={{ color: "#94a3b8", fontSize: "12px", marginBottom: "4px" }}>{label}</p>
        <p style={{ color: "#f8fafc", fontSize: "22px", fontWeight: "700", margin: "0 0 4px" }}>
          {value} <span style={{ fontSize: "13px", color: "#64748b" }}>{config.unit}</span>
        </p>
        <p style={{ color, fontSize: "12px", fontWeight: "600", margin: 0 }}>{status}</p>
      </div>
    );
  }
  return null;
};

const CustomDot = ({ cx, cy, value, config }) => {
  if (cx == null || cy == null) return null;
  const color = getColor(value, config.thresholds);
  const isHigh = value >= config.thresholds.high;
  return (
    <g>
      {isHigh && (
        <circle cx={cx} cy={cy} r={10} fill="none"
          stroke="#ef4444" strokeWidth={1} opacity={0.4} />
      )}
      <circle cx={cx} cy={cy} r={5} fill={color} stroke="#0f172a" strokeWidth={2} />
    </g>
  );
};

const CustomActiveDot = ({ cx, cy, value, config }) => {
  if (cx == null || cy == null) return null;
  const color = getColor(value, config.thresholds);
  const isHigh = value >= config.thresholds.high;
  return (
    <g>
      {isHigh && (
        <>
          <circle cx={cx} cy={cy} r={16} fill="none" stroke="#ef4444" strokeWidth={1} opacity={0.2} />
          <circle cx={cx} cy={cy} r={12} fill="none" stroke="#ef4444" strokeWidth={1} opacity={0.3} />
        </>
      )}
      <circle cx={cx} cy={cy} r={8} fill={color} stroke="#0f172a" strokeWidth={2} />
    </g>
  );
};

// Area fill that blends color horizontally just like the line segments do
const AreaFill = ({ points, data, config }) => {
  if (!points || points.length < 2) return null;
  const bottomY = Math.max(...points.map(p => p.y)) + 40;
  const STEPS = 20;

  return (
    <g>
      {points.map((point, i) => {
        if (i === 0) return null;
        const prev = points[i - 1];
        const colorStart = getColor(data[i - 1][config.dataKey], config.thresholds);
        const colorEnd   = getColor(data[i][config.dataKey], config.thresholds);

        const cpX1 = prev.x + (point.x - prev.x) * 0.4;
        const cpX2 = prev.x + (point.x - prev.x) * 0.6;

        const bezier = (t) => {
          const mt = 1 - t;
          return {
            x: mt*mt*mt*prev.x + 3*mt*mt*t*cpX1 + 3*mt*t*t*cpX2 + t*t*t*point.x,
            y: mt*mt*mt*prev.y + 3*mt*mt*t*prev.y + 3*mt*t*t*point.y + t*t*t*point.y,
          };
        };

        // Split each segment into vertical slices, each with a blended color
        return (
          <g key={i}>
            {Array.from({ length: STEPS }).map((_, s) => {
              const t0 = s / STEPS;
              const t1 = (s + 1) / STEPS;
              const p0 = bezier(t0);
              const p1 = bezier(t1);
              const color = lerpColor(colorStart, colorEnd, (t0 + t1) / 2);
              const gradId = `areaSlice-${i}-${s}`;

              const slicePath = `
                M ${p0.x} ${bottomY}
                L ${p0.x} ${p0.y}
                L ${p1.x} ${p1.y}
                L ${p1.x} ${bottomY}
                Z
              `;

              return (
                <g key={s}>
                  <defs>
                    <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={color} stopOpacity={0.3} />
                      <stop offset="100%" stopColor={color} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <path d={slicePath} fill={`url(#${gradId})`} />
                </g>
              );
            })}
          </g>
        );
      })}
    </g>
  );
};

const makeLineSegments = (data, config) => (props) => {
  const { points } = props;
  if (!points || points.length < 2) return null;
  const STEPS = 20;

  return (
    <g>
      {/* Area fill first so line renders on top */}
      <AreaFill points={points} data={data} config={config} />

      {points.map((point, i) => {
        if (i === 0) return null;
        const prev = points[i - 1];
        const colorStart = getColor(data[i - 1][config.dataKey], config.thresholds);
        const colorEnd   = getColor(data[i][config.dataKey], config.thresholds);
        const isHigh = data[i][config.dataKey] >= config.thresholds.high;

        const cpX1 = prev.x + (point.x - prev.x) * 0.4;
        const cpX2 = prev.x + (point.x - prev.x) * 0.6;

        const bezier = (t) => {
          const mt = 1 - t;
          return {
            x: mt*mt*mt*prev.x + 3*mt*mt*t*cpX1 + 3*mt*t*t*cpX2 + t*t*t*point.x,
            y: mt*mt*mt*prev.y + 3*mt*mt*t*prev.y + 3*mt*t*t*point.y + t*t*t*point.y,
          };
        };

        const subSegments = [];
        for (let s = 0; s < STEPS; s++) {
          const t0 = s / STEPS;
          const t1 = (s + 1) / STEPS;
          const p0 = bezier(t0);
          const p1 = bezier(t1);
          const color = lerpColor(colorStart, colorEnd, (t0 + t1) / 2);
          subSegments.push({ p0, p1, color });
        }

        return (
          <g key={i}>
            {isHigh && (
              <path
                d={`M ${prev.x} ${prev.y} C ${cpX1} ${prev.y} ${cpX2} ${point.y} ${point.x} ${point.y}`}
                fill="none" stroke="#ef4444" strokeWidth={10} strokeLinecap="round" opacity={0.15}
              />
            )}
            {subSegments.map((seg, j) => (
              <line
                key={j}
                x1={seg.p0.x} y1={seg.p0.y}
                x2={seg.p1.x} y2={seg.p1.y}
                stroke={seg.color}
                strokeWidth={3}
                strokeLinecap="round"
              />
            ))}
          </g>
        );
      })}
    </g>
  );
};

export default function ReusableGraph({ data, config }) {
  const formattedData = data.map((d) => ({
    ...d,
    displayDate: formatDate(d[config.dateKey]),
  }));

  const values = data.map((d) => d[config.dataKey]);
  const avg = Math.round(values.reduce((a, b) => a + b, 0) / values.length);
  const max = Math.max(...values);
  const min = Math.min(...values);

  return (
    <div style={{
      background: "linear-gradient(135deg, #0a0f1e 0%, #0d1b2a 100%)",
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Georgia', serif",
      padding: "40px 20px",
    }}>
      <div style={{ width: "100%", maxWidth: "860px" }}>

        <div style={{ marginBottom: "32px" }}>
          <p style={{ color: "#38bdf8", fontSize: "12px", letterSpacing: "4px", textTransform: "uppercase", margin: "0 0 8px" }}>
            Health Monitoring
          </p>
          <h1 style={{ color: "#f8fafc", fontSize: "36px", fontWeight: "700", margin: "0 0 6px" }}>
            {config.title}
          </h1>
        </div>

        <div style={{ display: "flex", gap: "16px", marginBottom: "32px" }}>
          {[
            { label: "Average", value: avg, color: getColor(avg, config.thresholds) },
            { label: "Peak",    value: max, color: "#ef4444" },
            { label: "Lowest", value: min, color: "#38bdf8" },
          ].map((stat) => (
            <div key={stat.label} style={{
              flex: 1, background: "#0f172a", border: "1px solid #1e293b",
              borderRadius: "12px", padding: "16px 20px",
            }}>
              <p style={{ color: "#475569", fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", margin: "0 0 6px" }}>
                {stat.label}
              </p>
              <p style={{ color: stat.color, fontSize: "28px", fontWeight: "700", margin: 0 }}>
                {stat.value}
                <span style={{ fontSize: "13px", color: "#475569", fontWeight: "400", marginLeft: "4px" }}>{config.unit}</span>
              </p>
            </div>
          ))}
        </div>

        <div style={{
          background: "#0f172a",
          border: "1px solid #1e293b",
          borderRadius: "16px",
          padding: "28px 16px 16px",
          boxShadow: max >= config.thresholds.high
            ? `0 0 40px #ef444422, inset 0 0 40px #ef444408`
            : "none",
        }}>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={formattedData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid stroke="#1e293b" strokeDasharray="4 4" vertical={false} />
              <XAxis dataKey="displayDate" tick={{ fill: "#475569", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis domain={config.yDomain} tick={{ fill: "#475569", fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip config={config} />} cursor={{ stroke: "#1e293b", strokeWidth: 1 }} />
              {config.referenceLines.map((ref) => (
                <ReferenceLine key={ref.value} y={ref.value} stroke={ref.color}
                  strokeDasharray="4 4" strokeWidth={1}
                  label={{ value: ref.label, fill: ref.color, fontSize: 11, position: "insideTopRight" }} />
              ))}
              <Line
                type="monotone"
                dataKey={config.dataKey}
                stroke="transparent"
                strokeWidth={3}
                dot={(props) => <CustomDot {...props} config={config} />}
                activeDot={(props) => <CustomActiveDot {...props} config={config} />}
                shape={(props) => makeLineSegments(data, config)(props)}
              />
            </LineChart>
          </ResponsiveContainer>

          <div style={{ display: "flex", gap: "24px", justifyContent: "center", marginTop: "12px" }}>
            {[
              { color: "#38bdf8", label: `Below Normal (<${config.thresholds.elevated})` },
              { color: "#22c55e", label: `Normal (${config.thresholds.elevated}–${config.thresholds.high - 1})` },
              { color: "#ef4444", label: `High (≥${config.thresholds.high})` },
            ].map((item) => (
              <div key={item.label} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: item.color }} />
                <span style={{ color: "#475569", fontSize: "12px" }}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
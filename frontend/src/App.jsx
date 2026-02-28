import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import IndexPage from "./pages/index-page";
import PatientsPage from "./pages/patient-page.jsx";
import ReusableGraph from "./components/graph-reusable.jsx"

function App() {
    const data = [
    { date: "2026-02-20", value: 72 },
    { date: "2026-02-21", value: 78 },
    { date: "2026-02-22", value: 85 },
    { date: "2026-02-23", value: 92 },
    { date: "2026-02-24", value: 88 },
    { date: "2026-02-25", value: 95 },
    { date: "2026-02-26", value: 81 },
  ];

  const config = {
    title: "Blood Pressure",

    // these MUST match keys in data above
    dateKey: "date",
    dataKey: "value",

    thresholds: {
      elevated: 75,
      high: 90,
    },

    yDomain: [60, 110],

    referenceLines: [
      { value: 75, color: "#22c55e", label: "Elevated" },
      { value: 90, color: "#ef4444", label: "High" },
    ],
  };
  return (
    // <Router>
    //   <Routes>
    //     {/* <Route path="/" element={<IndexPage />} />
    //     <Route path="/patients/:id" element={<PatientsPage />} /> */}
    //   </Routes>
    // </Router>
   <ReusableGraph data={data} config={config} />
  );
}

export default App;
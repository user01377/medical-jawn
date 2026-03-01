import React, { useState, useEffect } from "react";

const AVG_URL = "http://127.0.0.1:8000/get_bp_avg/";

export default function aiTip() {
  const [avg, setAvg] = useState(null);

  useEffect(() => {
    async function fetchPatients() {
      try {
        const res = await fetch(AVG_URL);
        if (!res.ok) throw new Error("Network error");

        const data = await res.json();
        setAvg(data.avg);
      } catch (err) {
        console.error("Fetch error:", err);
        setAvg(null);
      }
    }

    fetchPatients();
  }, []);

  if (avg === null) return <p>Loading...</p>;

  return (
    <div className="tip-container">
      {avg > 1.625 ? (
        <p>Focus on adding more fruits and vegetables to every meal — they help lower both blood pressure and cholesterol naturally.</p>
      ) : avg < 1.5 ? (
        <p>Focus on adding more protein and healthy fats — they may help increase blood pressure and cholesterol if needed.</p>
      ) : (
        <p>Your blood pressure and cholesterol are normal.</p>
      )}
    </div>
  );
}
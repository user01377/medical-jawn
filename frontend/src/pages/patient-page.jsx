import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ReusableGraph from "../components/graph-reusable.jsx"
import AiTip from "../components/aiTips.jsx";

import "../styles/patient-page.css"

const GET_PATIENT_URL = "http://127.0.0.1:8000/get-patient/"

async function fetchPatient(id) {
  try {
    const res = await fetch(`${GET_PATIENT_URL}${id}`);
    if (!res.ok) throw new Error("Network error");

    const data = await res.json();
  
    const patient = {
      id: data[0],
      name: data[1],
      age: data[2],
      weight: data[3], // weight is lbs
      height: data[4] // height is cm
    };
    return patient;
  } catch (err) {
    console.error("Fetch error:", err);
    return null;
  }
}

export default function PatientPage() {
  // gets the patient id from the URL
  const { patientURL } = useParams();
  const patientID = patientURL.split("-")[0];
  // console.log(patientID); // debugging

  const [patient, setPatient] = useState([]); // use state so no breakie when page is rendered

  // fetch patient via their id once after component mounts
  useEffect(() => {
    fetchPatient(patientID).then(setPatient);
  }, []);

  if (!patient) {
    return <p>Loading patient info...</p>;
  }

  return (
    <div className="page-wrapper">

      <header className="patient-header">
        {`Name: ${patient.name} | Age: ${patient.age} | Weight: ${patient.weight} | Height: ${patient.height}`}
      </header>

      <section className="patient-graphs">
        <ReusableGraph
          patientID={patientID}
          apiURL="http://127.0.0.1:8000/get-patient-sys-data/"
          config={{
            title: "Systolic Blood Pressure",
            dataKey: "systolic",
            unit: "mmHg",
            yDomain: [80, 180],
            thresholds: { elevated: 120, high: 140 },
            referenceLines: [
              { value: 120, label: "Elevated", color: "#22c55e" },
              { value: 130, label: "Stage 1 High", color: "#facc15" },
              { value: 140, label: "Stage 2 High", color: "#ef4444" },
            ]
          }}
        />

        <ReusableGraph
          patientID={patientID}
          apiURL="http://127.0.0.1:8000/get-patient-diastolic/"
          config={{
            title: "Diastolic Blood Pressure",
            dataKey: "diastolic",
            unit: "mmHg",
            yDomain: [50, 110],
            thresholds: { elevated: 80, high: 90 },
            referenceLines: [
              { value: 80, label: "Elevated", color: "#22c55e" },
              { value: 90, label: "High", color: "#ef4444" },
            ]
          }}
        />

        <ReusableGraph
          patientID={patientID}
          apiURL="http://127.0.0.1:8000/get-patient-cholesterol/"
          config={{
            title: "Cholestrol Levels",
            dataKey: "cholesterol",
            unit: "mmHg",
            yDomain: [100, 300],
            thresholds: { elevated: 200, high: 240 },
            referenceLines: [
              { value: 200, label: "Elevated", color: "#22c55e" },
              { value: 240, label: "High", color: "#ef4444" },
            ]
          }}
        />

      </section>

      <footer>
          <AiTip patientID={patientID}/>
      </footer>
    
    </div>
  );
}
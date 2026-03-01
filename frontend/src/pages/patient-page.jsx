import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

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
    const [patient, setPatient] = useState([]); // use state so no breakie
  
    // fetch patient via their id once after component mounts
    useEffect(() => {
      fetchPatient().then(setPatient);
    }, []);

  if (!patient) {
    return <p>Loading patient info...</p>;
  }

  return (
    <div className="page-wrapper">
      <header>
        <h1>{patient.name}</h1>
      </header>

      <section className="patient-graph">

      </section>
    
      <Link to="/" className="back-link">Back to Home</Link>
    </div>
  );
}
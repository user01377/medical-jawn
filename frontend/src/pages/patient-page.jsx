import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

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

      </section>
    
    </div>
  );
}
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import "../styles/patient-page.css";

const GET_PATIENT_URL = "";

export default function PatientPage() {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);

  // hard coded data just like the home page
  const patients = [
    { id: 1, name: "John Doe", age: 30, condition: "Flu" },
    { id: 2, name: "Jane Smith", age: 25, condition: "Cold" },
    { id: 3, name: "Alice Johnson", age: 40, condition: "Allergy" },
    { id: 4, name: "Bob Brown", age: 35, condition: "Checkup" },
  ];

  useEffect(() => {
    // find patent by ID for now
    const foundPatient = patients.find(
      (p) => p.id === parseInt(id, 10)
    );
    setPatient(foundPatient);
  }, [id]);

  if (!patient) {
    return (
      <div className="page-wrapper">
        <header>
          <h1>Patient Not Found</h1>
        </header>
        <Link to="/">Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <header>
        <h1>{patient.name}</h1>
      </header>

      <section className="patient-details">
        <p><strong>Age:</strong> {patient.age}</p>
        <p><strong>Condition:</strong> {patient.condition}</p>
      </section>

      <Link to="/" className="back-link">← Back to Home</Link>
    </div>
  );
}
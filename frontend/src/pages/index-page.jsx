import { Link } from "react-router-dom";
import React, { useState } from "react";
import "../styles/index-page.css";

const GET_ALL_PATIENTS_URL = "";

export default function IndexPage() { 
  const [searchTerm, setSearchTerm] = useState("");
  
  // hard coded the patient list on the home page
  const patients = [
    { id: 1, name: "John Doe" },
    { id: 2, name: "Jane Smith" },
    { id: 3, name: "Alice Johnson" },
    { id: 4, name: "Bob Brown" },
  ];

  // Filter patients based on search term (case-insensitive)
  const filteredPatients = patients.filter((patient) =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page-wrapper">
      <header>
        <h1>Medical Jawn</h1>
      </header>

      <section className="info-center">
        <input
          className="search-box"
          type="search"
          placeholder="Search For A Patient"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="patients-list">
          {filteredPatients.length > 0 ? (
            filteredPatients.map((patient) => (
              <Link
                key={patient.id}
                to={`/patients/${patient.id}`}
                className="patient-link"
              >
                {patient.name}
              </Link>
            ))
          ) : (
            <p style={{ color: "#00c8ff", padding: "12px" }}>
              No patients found.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
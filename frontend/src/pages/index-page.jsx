import React from "react";
import "../styles/index-page.css";

const GET_ALL_USERS_URL = "";

export default function IndexPage() { 

  const patients = [
    { id: 1, name: "John Doe" },
    { id: 2, name: "Jane Smith" },
    { id: 3, name: "Alice Johnson" },
    { id: 4, name: "Bob Brown" },
  ];

  return (
    <div className="page-wrapper">

      <header>
        <h1>Medical Jawn</h1>
      </header>

      <section className="info-center">

        <input className="search-box" type="search" placeholder="Search For A Patient" />

        <div className="patients-list">
          {patients.map((patient) => (
            <a
              key={patient.id}
              href={`/patients/${patient.name}`}
              className="patient-link"
            >
              {patient.name}
            </a>
          ))}
        </div>

      </section>

    </div>
  );
}
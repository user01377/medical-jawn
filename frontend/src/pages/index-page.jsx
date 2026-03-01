import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import "../styles/index-page.css";

const GET_ALL_PATIENTS_URL = "http://127.0.0.1:8000/all-patients";

// helper to convert the name into a more url readable link
// /\s matches any whitespace char, + means consecutive, /g replaces all places where all the whitespace is
function slugifyName(name) {
  return name.toLowerCase().replace(/\s+/g, "-");
}

// helper to conver the tuple from the backend into json
function parseTuple(tupleData) {
  return tupleData.map(tuple => ({
    id: tuple[0],
    name: tuple[1]
  }));
}

// helper to fetch all patient data
async function fetchPatients() {
  try {
    const res = await fetch(GET_ALL_PATIENTS_URL);
    if (!res.ok) throw new Error("Network error");

    const data = await res.json();
    const patients = parseTuple(data); // uses the helper function above to convert the tuple into json
    // console.log(patients); // debugging to console
    return patients;
  } catch (err) {
    console.error("Fetch error:", err);
    return [];
  }
}

export default function IndexPage() {
  const [patients, setPatients] = useState([]); // store fetched patients
  const [searchTerm, setSearchTerm] = useState("");

  // fetch patients once after component mounts
  useEffect(() => {
    fetchPatients().then(setPatients);
  }, []);
  
  // filter the patients based on the "contains" regex, is case insensitive
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
                to={`/patients/${patient.id}-${slugifyName(patient.name)}`}
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
import React from "react";
import "../styles/index-page.css";

export default function IndexPage() {
  return (
    <div className="page-wrapper">

      <header>
        <h1>Medical Jawn</h1>
      </header>

      <section className="info-center">
        <input className="search-box" type="search" placeholder="Search For A Patient" />
      </section>

    </div>
  );
}
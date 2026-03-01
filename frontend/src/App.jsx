import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import IndexPage from "./pages/index-page";
import PatientsPage from "./pages/patient-page.jsx";
import ReusableGraph from "./components/graph-reusable.jsx"

function App() {
    
  return (
    // <Router>
    //   <Routes>
    //     {/* <Route path="/" element={<IndexPage />} />
    //     <Route path="/patients/:id" element={<PatientsPage />} /> */}
    //   </Routes>
    // </Router>
   <ReusableGraph/>
  );
}

export default App;
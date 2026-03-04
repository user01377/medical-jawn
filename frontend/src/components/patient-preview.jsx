import '../styles/patient-preview.css'
import { Link } from "react-router-dom"

function PatientPreview () {
    const patient = {
        id: 1,
        name: "Vincent Vue",
        age: 99,
        weight: 893,
        height: 4
    };

    const slugifyName = (name) => {
        return name.toLowerCase().replace(/\s+/g, "-");
    };

    const patientDocs = [
        { record_id: '00000001' },
        { record_id: '00000002' },
        { record_id: '00000003' },
        { record_id: '00000004' },
    ];

    return (
        <div className="preview-container">
            <h1>{patient.name}</h1>
            <p>
                Age : {patient.age} years | 
                Weight : {patient.weight} lbs | 
                Height : {patient.height} inches
            </p>

            <ul>
                {patientDocs.map((doc) => (
                    <li key={doc.record_id}>
                        {doc.record_id}
                    </li>
                ))}
            </ul>

            <Link 
                to={`/patients/${patient.id}-${slugifyName(patient.name)}`}
            >
                <button>View more</button>
            </Link>
        </div>
    );
}

export default PatientPreview;
import React from "react";
import { PatientDashboardProps } from "../../types/transformer";
import '../../static/css/patientDetails.css';

// Define interfaces for the data structures


const PatientDashboard: React.FC<PatientDashboardProps> = ({ patientData }) => {
    // Extract data from patientData prop
    const {
        messageHeader,
        patient,
        visit,
        observations,
        allergies,
        diagnosis,
        insurance,
    } = patientData;

    // Format date YYYYMMDD to MM/DD/YYYY
    const formatDate = (dateString: string | undefined): string => {
        if (!dateString || dateString.length !== 8) return dateString || "";
        return `${dateString.substring(4, 6)}/${dateString.substring(
            6,
            8
        )}/${dateString.substring(0, 4)}`;
    };

    // Extract initials for avatar
    const getInitials = (): string => {
        if (!patient || !patient.name) return "";
        return `${patient.name.firstName?.charAt(0) || ""}${patient.name.lastName?.charAt(0) || ""
            }`;
    };

    // Clean HTML tags from strings
    const cleanHtmlTags = (str: string | undefined): string => {
        if (!str) return "";
        return str.replace(/<[^>]*>/g, "");
    };

    return (
        <div className="dashboard-container">
            <div className="header">
                <h1>Patient Medical Record</h1>
                <div className="patient-info">
                    <div className="patient-avatar">{getInitials()}</div>
                    <div>
                        <h2>
                            {patient?.name?.lastName}, {patient?.name?.firstName}
                        </h2>
                        <p>MRN: {patient?.mrn}</p>
                    </div>
                </div>
            </div>

            <div className="message-info">
                <span>Message ID: {messageHeader?.messageId}</span>
                <span>Type: {messageHeader?.messageType}</span>
                <span>Timestamp: {messageHeader?.timestamp}</span>
            </div>

            <div className="content-grid">
                <div className="card">
                    <div className="card-header">Patient Demographics</div>
                    <div className="card-body">
                        <div className="data-row">
                            <span className="label">Name:</span>
                            <span className="value">
                                {patient?.name?.lastName}, {patient?.name?.firstName}
                            </span>
                        </div>
                        <div className="data-row">
                            <span className="label">Date of Birth:</span>
                            <span className="value">{formatDate(patient?.dob)}</span>
                        </div>
                        <div className="data-row">
                            <span className="label">Gender:</span>
                            <span className="value">
                                {patient?.gender === "M"
                                    ? "Male"
                                    : patient?.gender === "F"
                                        ? "Female"
                                        : patient?.gender}
                            </span>
                        </div>
                        <div className="data-row">
                            <span className="label">MRN:</span>
                            <span className="value">{patient?.mrn}</span>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="card-header">Contact Information</div>
                    <div className="card-body">
                        <div className="data-row">
                            <span className="label">Address:</span>
                            <span className="value">
                                {patient?.address?.street}
                                <br />
                                {patient?.address?.city}, {patient?.address?.state}{" "}
                                {patient?.address?.zip}
                            </span>
                        </div>
                        {patient?.phones?.map((phone, index) => (
                            <div className="data-row" key={index}>
                                <span className="label">
                                    {phone.use === "PH"
                                        ? "Home Phone:"
                                        : phone.use === "CP"
                                            ? "Cell Phone:"
                                            : "Phone:"}
                                </span>
                                <span className="value">
                                    {phone.number.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3")}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="card">
                    <div className="card-header">Visit Information</div>
                    <div className="card-body">
                        <div className="data-row">
                            <span className="label">Facility:</span>
                            <span className="value">{visit?.location?.facility}</span>
                        </div>
                        <div className="data-row">
                            <span className="label">Department:</span>
                            <span className="value">{visit?.location?.department}</span>
                        </div>
                        <div className="data-row">
                            <span className="label">Attending Physician:</span>
                            <span className="value">{visit?.attendingPhysician?.name}</span>
                        </div>
                        <div className="data-row">
                            <span className="label">Physician ID:</span>
                            <span className="value">{visit?.attendingPhysician?.id}</span>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="card-header">Insurance Information</div>
                    <div className="card-body">
                        <div className="data-row">
                            <span className="label">Company:</span>
                            <span className="value">{cleanHtmlTags(insurance?.company)}</span>
                        </div>
                        <div className="data-row">
                            <span className="label">Plan ID:</span>
                            <span className="value">{cleanHtmlTags(insurance?.planId)}</span>
                        </div>
                    </div>
                </div>

                <div className="card full-width">
                    <div className="card-header">Allergies & Diagnosis</div>
                    <div className="card-body">
                        {allergies?.map((allergy, index) => (
                            <div className="alert" key={index}>
                                <div className="alert-icon">⚠️</div>
                                <div>
                                    <strong>Allergies:</strong> {allergy.substance} - Reaction:{" "}
                                    {cleanHtmlTags(allergy.reaction)}
                                    {allergy.onsetDate &&
                                        ` (First observed: ${cleanHtmlTags(allergy.onsetDate)})`}
                                </div>
                            </div>
                        ))}

                        {diagnosis?.map((diag, index) => (
                            <React.Fragment key={index}>
                                <div className="data-row">
                                    <span className="label">Diagnosis:</span>
                                    <span className="value">
                                        {cleanHtmlTags(diag.description)}{" "}
                                        <span className="badge badge-danger">{diag.code}</span>
                                    </span>
                                </div>
                                <div className="data-row">
                                    <span className="label">Diagnosis Date:</span>
                                    <span className="value">{cleanHtmlTags(diag.date)}</span>
                                </div>
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                <div className="card full-width">
                    <div className="card-header">Observations</div>
                    <div className="card-body">
                        {observations?.map((obs, index) => (
                            <div className="observation-item" key={index}>
                                <div className="observation-header">
                                    <span className="observation-type">{obs.type}</span>
                                    <span>
                                        {messageHeader?.timestamp
                                            ?.substring(0, 8)
                                            .replace(/(\d{4})(\d{2})(\d{2})/, "$2/$3/$1")}
                                    </span>
                                </div>
                                <div className="observation-value">
                                    {obs.value} {typeof obs.unit === "string" ? obs.unit : ""}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientDashboard;
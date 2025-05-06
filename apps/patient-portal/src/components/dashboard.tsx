import { useState, useEffect } from "react";
import axios from "axios";
import CreatePatient from "./CreatePatient";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
import { ROLE } from "../constants";

interface PatientInfo {
  name: string;
  gender: string;
  birthDate: string;
  address: string;
  phone: string;
  email: string;
  maritalStatus: string;
  language: string;
  practitioner: string;
  organization: string;
  id: string | null | undefined;
}

interface MedicationRequest {
  therapyType: string;
  dosageInstruction: string;
}

function Dashboard() {
  const [patient, setPatient] = useState<PatientInfo | null>(null);
  const [medicationRequest, setMedicationRequest] =
    useState<MedicationRequest | null>(null);
  const userRole = localStorage.getItem("userRole");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatient = async () => {
      const token = localStorage.getItem("access_token");
      const patientId =
        localStorage.getItem("patient_id") === "undefined"
          ? undefined
          : localStorage.getItem("patient_id");
      const userId = patientId || localStorage.getItem("id");

      if (!token) {
        console.warn("No access token found!");
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:3007/v2/${userRole}/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = response.data;

        const nameEntry = data.name?.[0] || {};
        const addressEntry = data.address?.[0] || {};
        const telecomPhone = data.telecom?.find(
          (t: any) => t.system === "phone"
        );
        const telecomEmail = data.telecom?.find(
          (t: any) => t.system === "email"
        );

        setPatient({
          name:
            nameEntry.text ||
            `${nameEntry.given?.join(" ")} ${nameEntry.family}`,
          gender: data.gender,
          birthDate: data.birthDate,
          address: addressEntry.line?.join(", ") + ", " + addressEntry.city,
          phone: telecomPhone?.value || "",
          email: telecomEmail?.value || "",
          maritalStatus: data.maritalStatus?.text || "N/A",
          language: data.communication?.[0]?.language?.text || "N/A",
          practitioner: data.generalPractitioner?.[0]?.display || "N/A",
          organization: data.managingOrganization?.display || "N/A",
          id: patientId,
        });
      } catch (err) {
        console.error("Failed to fetch patient data:", err);
      }
    };

    fetchPatient();
  }, []);

  useEffect(() => {
    console.log("medication request state- ", medicationRequest);
  }, [medicationRequest]);

  const getMedicationRequest = async () => {
    const token = localStorage.getItem("access_token");
    const patientId =
      localStorage.getItem("patient_id") === "undefined"
        ? undefined
        : localStorage.getItem("patient_id");

    if (!token) {
      console.warn("No access token found!");
      return;
    }

    try {
      const response = await axios.get(
        `https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4/MedicationRequest?patient=${patientId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data;
      console.log("medication request - >", data);
      setMedicationRequest({
        therapyType: data.entry[0].resource.courseOfTherapyType.text,
        dosageInstruction: data.entry[0].resource.dosageInstruction[0].text,
      });
    } catch (err) {
      console.error("Failed to fetch patient data:", err);
    }
  };

  if (!patient)
    return (
      <div className="centered-loading">
        Loading {userRole === ROLE.PATIENT ? "Patient " : "Practitioner"}{" "}
        info...
      </div>
    );

  return (
    <div className="dashboard">
      <h1 className="dashboard-title text-2xl font-bold my-6 text-center">
        {userRole === ROLE.PATIENT ? "Patient " : "Practitioner"} Dashboard
      </h1>

      {userRole === ROLE.PRACTITIONER ? (
        <div className="flex justify-center gap-4 mb-4">
          <div className="flex-1 w-max">
            <CreatePatient />
          </div>
          <div className="flex-1 w-max">
            <Button
              label="Book Appointment"
              onClick={() => navigate("/appointment")}
            />
            <Button
              label="Appointment Tracker"
              onClick={() => navigate("/patientAppointments")}
            />
          </div>
        </div>
      ) : null}

      <div className="card-grid grid grid-cols-2 gap-4 p-4">
        {Object.entries(patient)
          .filter(([_, value]) => value) // filters out undefined, null, '', 0, false
          .map(([key, value]) => (
            <div key={key} className="card p-4 border rounded shadow">
              <p className="card-label font-semibold">
                {key.replace(/([A-Z])/g, " $1")}
              </p>
              <p className="card-value text-gray-700">{value}</p>
            </div>
          ))}
      </div>

      {userRole === ROLE.PATIENT ? (
        <>
          {" "}
          <Button
            label="Get Medication Request"
            onClick={() => getMedicationRequest()}
          />
          <div className="card-grid grid grid-cols-2 gap-4 p-4">
            {medicationRequest &&
              Object.entries(medicationRequest).map(([key, value]) => (
                <div key={key} className="card p-4 border rounded shadow">
                  <p className="card-label font-semibold">
                    {key.replace(/([A-Z])/g, " $1")}
                  </p>
                  <p className="card-value text-gray-700">{value}</p>
                </div>
              ))}
          </div>
        </>
      ) : null}
    </div>
  );
}

export default Dashboard;

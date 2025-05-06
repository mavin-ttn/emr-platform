import { useState, useEffect } from "react";
import axios from "axios";
import CreatePatient from "./CreatePatient";
import ROLE from "../constants/index";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
import Table from "./table";

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

interface SurgicalHistory {}

interface MedicalHistory {}
interface SocialHistory {
  observationType?: string;
  value?: string;
  startDate?: string;
  endDate?: string;
  issuedDate?: string;
  performer?: string;
}

function Dashboard() {
  const [patient, setPatient] = useState<PatientInfo | null>(null);
  const [medicationRequest, setMedicationRequest] =
    useState<MedicationRequest | null>(null);
  const userRole = localStorage.getItem("userRole");

  const navigate = useNavigate();
  const [surgicalHistoryList, setSurgicalHistoryList] = useState<any[]>([]);
  const [medicalHistory, setMedicalHistory] = useState<MedicalHistory | null>(
    null
  );
  const [socialHistoryList, setSocialHistoryList] = useState<any[]>([]);

  const surgicalHeaders: string[] = [
    "Condition",
    "SNOMED",
    "ICD9",
    "ICD10",
    "Clinical Status",
    "Verification Status",
    "Categories",
    "Onset Date",
    "Recorded Date",
  ];

  const socialHeaders: string[] = [
    "Type",
    "Status",
    "Value",
    "StartDate",
    "EndDate",
    "IssuedDate",
  ];

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

  // const getMedicalHistory = async () => {
  //   const token = localStorage.getItem('access_token');
  //   const patientId =
  //     localStorage.getItem('patient_id') === 'undefined'
  //       ? undefined
  //       : localStorage.getItem('patient_id');

  //   if (!token) {
  //     console.warn('No access token found!');
  //     return;
  //   }

  //   try {
  //     const response = await axios.get(
  //       `http://localhost:3007/v2/patient-medical-history/${patientId}`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );

  //     const data = response.data;
  //     console.log("data--",data)
  //    setMedicalHistory({
  //       therapyType: data.entry[0].resource.courseOfTherapyType.text,
  //       dosageInstruction: data.entry[0].resource.dosageInstruction[0].text,
  //     });
  //   } catch (err) {
  //     console.error('Failed to fetch Medical History data:', err);
  //   }
  // };

  const getSurgicalHistory = async () => {
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
        `http://localhost:3007/v2/patient-medical-history/${patientId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data;
      console.log("data--", data);

      if (!data?.entry?.length) return;

      const conditions = data.entry
        .filter((e: any) => e.resource?.resourceType === "Condition")
        .map((cond: any) => {
          const coding = cond.resource.code?.coding || [];
          const snomed = coding.find(
            (c: any) => c.system === "http://snomed.info/sct"
          );
          const icd9 = coding.find(
            (c: any) => c.system === "http://hl7.org/fhir/sid/icd-9-cm"
          );
          const icd10 = coding.find(
            (c: any) => c.system === "http://hl7.org/fhir/sid/icd-10-cm"
          );

          return {
            Condition:
              cond.resource.code?.text ||
              snomed?.display ||
              icd10?.display ||
              "Unknown",
            SNOMED: snomed?.display,
            ICD9: icd9?.display,
            ICD10: icd10?.display,
            "Clinical Status": cond.resource.clinicalStatus?.text || null,
            "Verification Status":
              cond.resource.verificationStatus?.text || null,
            Categories: (cond.resource.category || []).map(
              (cat: any) => cat.text
            ),
            "Onset Date": cond.resource.onsetDateTime || null,
            "Recorded Date": cond.resource.recordedDate || null,
          };
        });

      setSurgicalHistoryList(conditions);
    } catch (err) {
      console.error("Failed to fetch Surgical History data:", err);
    }
  };
  const getSocialHistory = async () => {
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
        `http://localhost:3007/v2/patient-social-history/${patientId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data;
      console.log("data--", data);

      if (!data?.entry?.length) return;

      const socialHistories: SocialHistory[] = data.entry
        .filter((e: any) => e.resource?.resourceType === "Observation")
        .map((obs: any) => ({
          Type:
            obs.resource.code?.text ||
            obs.resource.code?.coding?.[0]?.display ||
            "Unknown",
          Status: obs.resource.status || "-",
          Value:
            obs.resource.valueCodeableConcept?.text ||
            obs.resource.valueCodeableConcept?.coding?.[0]?.display ||
            "-",
          StartDate: obs.resource.effectivePeriod?.start || "-",
          EndDate: obs.resource.effectivePeriod?.end || "-",
          IssuedDate: obs.resource.issued || "-",
        }));

      setSocialHistoryList(socialHistories);
    } catch (err) {
      console.error("Failed to fetch Social History data:", err);
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
          <Button
            label="Get Surgical History"
            onClick={() => getSurgicalHistory()}
          />
          {surgicalHistoryList.length > 0 && (
            <Table headers={surgicalHeaders} data={surgicalHistoryList} />
          )}
          <div></div>
          {/* <Button
            label="Get Medical History"
            onClick={() => getMedicalHistory()}
          />
          <div className="card-grid grid grid-cols-2 gap-4 p-4">
            {medicalHistory &&
              Object.entries(medicalHistory).map(([key, value]) => (
                <div key={key} className="card p-4 border rounded shadow">
                  <p className="card-label font-semibold">
                    {key.replace(/([A-Z])/g, ' $1')}
                  </p>
                  <p className="card-value text-gray-700">{value}</p>
                </div>
              ))}
          </div> */}
          <Button
            label="Get Social History"
            onClick={() => getSocialHistory()}
          />
          {socialHistoryList.length > 0 && (
            <Table headers={socialHeaders} data={socialHistoryList} />
          )}
        </>
      ) : null}
    </div>
  );
}

export default Dashboard;

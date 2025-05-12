import { useState, useEffect } from "react";
import axios from "axios";
import CreatePatient from "./CreatePatient";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
import Table from "./table";
import { ROLE } from "../constants";
import { formatDate } from "../utils/helper";
import { getAuthInfo } from "../utils/auth";

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

interface SurgicalHistory {
  condition: string;
  snomed?: string;
  icd9?: string;
  icd10?: string;
  clinicalStatus?: string;
  verificationStatus?: string;
  categories: string[];
  onsetDate?: string;
  recordedDate?: string;
}

interface MedicalHistory {
  condition: string;
  clinicalStatus: string;
  verificationStatus: string;
  categories: string[];
  onsetDateTime: string;
  recordedDate: string;
  codes: string[];
}
interface SocialHistory {
  type: string;
  status: string;
  value: string;
  startDate: string;
  endDate: string;
  issuedDate: string;
}

function Dashboard() {
  const [patient, setPatient] = useState<PatientInfo | null>(null);
  const [medicationRequest, setMedicationRequest] =
    useState<MedicationRequest | null>(null);
  const userRole = localStorage.getItem("userRole");

  const navigate = useNavigate();
  const [medicalHistoryList, setMedicalHistoryList] = useState<
    MedicalHistory[]
  >([]);
  const [surgicalHistoryList, setSurgicalHistoryList] = useState<
    SurgicalHistory[]
  >([]);
  const [socialHistoryList, setSocialHistoryList] = useState<SocialHistory[]>(
    []
  );

  const medicalHeaders = [
    { key: "condition", label: "Condition" },
    { key: "clinicalStatus", label: "Clinical Status" },
    { key: "verificationStatus", label: "Verification Status" },
    { key: "categories", label: "Categories" },
    { key: "onsetDateTime", label: "Onset Date Time" },
    { key: "recordedDate", label: "Recorded Date" },
    { key: "codes", label: "Codes" },
  ];

  const surgicalHeaders = [
    { key: "condition", label: "Condition" },
    { key: "snomed", label: "SNOMED" },
    { key: "icd9", label: "ICD9" },
    { key: "icd10", label: "ICD10" },
    { key: "clinicalStatus", label: "Clinical Status" },
    { key: "verificationStatus", label: "Verification Status" },
    { key: "categories", label: "Categories" },
    { key: "onsetDate", label: "Onset Date" },
    { key: "recordedDate", label: "Recorded Date" },
  ];

  const socialHeaders = [
    { key: "type", label: "Type" },
    { key: "status", label: "Status" },
    { key: "value", label: "Value" },
    { key: "startDate", label: "Start Date" },
    { key: "endDate", label: "End Date" },
    { key: "issuedDate", label: "Issued Date" },
  ];

  useEffect(() => {
    const fetchPatient = async () => {
      const auth = getAuthInfo();
      if (!auth) return;
      const { token, patientId, userId } = auth;

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
    const auth = getAuthInfo();
    if (!auth) return;
    const { token, patientId } = auth;

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

  const mapSystemToName = (systemUrl: string) => {
    if (systemUrl.includes("icd-10")) return "ICD-10-CM";
    if (systemUrl.includes("icd-9")) return "ICD-9-CM";
    if (systemUrl.includes("snomed")) return "SNOMED";
    return "Other";
  };

  const getMedicalHistory = async () => {
    const auth = getAuthInfo();
    if (!auth) return;
    const { token, patientId } = auth;

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

      if (!data?.entry?.length) return [];

      const newMedicalData: MedicalHistory[] = data.entry
        .filter((e: any) => e.resource?.resourceType === "Condition")
        .map((cond: any): MedicalHistory => {
          const resource = cond.resource;

          const codes = (resource.code?.coding || []).map((code: any) => ({
            system: mapSystemToName(code.system || ""),
            code: code.code || "",
            display: code.display || "",
          }));

          return {
            condition: resource.code?.text || "",
            clinicalStatus: resource.clinicalStatus?.text || "",
            verificationStatus: resource.verificationStatus?.text || "",
            categories: (resource.category || []).map(
              (cat: any) => cat.text || ""
            ),
            onsetDateTime: resource.onsetDateTime || "",
            recordedDate: resource.recordedDate || "",
            codes: codes?.map((obj: any) => obj.display || ""),
          };
        });
      setMedicalHistoryList(newMedicalData);
    } catch (err) {
      console.error("Failed to fetch Medical History data:", err);
    }
  };

  const getSurgicalHistory = async () => {
    const auth = getAuthInfo();
    if (!auth) return;
    const { token, patientId } = auth;

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

      const surgicalData: SurgicalHistory[] = data.entry
        .filter((e: any) => e.resource?.resourceType === "Condition")
        .map((cond: any): SurgicalHistory => {
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
            condition:
              cond.resource.code?.text ||
              snomed?.display ||
              icd10?.display ||
              "Unknown",
            snomed: snomed?.display,
            icd9: icd9?.display,
            icd10: icd10?.display,
            clinicalStatus: cond.resource.clinicalStatus?.text || "",
            verificationStatus: cond.resource.verificationStatus?.text || "",
            categories: (cond.resource.category || []).map(
              (cat: any) => cat.text || ""
            ),
            onsetDate: cond.resource.onsetDateTime || "",
            recordedDate: cond.resource.recordedDate || "",
          };
        });

      setSurgicalHistoryList(surgicalData);
    } catch (err) {
      console.error("Failed to fetch Surgical History data:", err);
    }
  };

  const getSocialHistory = async () => {
    const auth = getAuthInfo();
    if (!auth) return;
    const { token, patientId } = auth;

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
        .map(
          (obs: any): SocialHistory => ({
            type:
              obs.resource.code?.text ||
              obs.resource.code?.coding?.[0]?.display ||
              "Unknown",
            status: obs.resource.status || "",
            value:
              obs.resource.valueCodeableConcept?.text ||
              obs.resource.valueCodeableConcept?.coding?.[0]?.display ||
              "",
            startDate: obs.resource.effectivePeriod?.start || "",
            endDate: obs.resource.effectivePeriod?.end || "",
            issuedDate: formatDate(obs.resource.issued) || "",
          })
        );

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
          <Button
            label="Get Medical History"
            onClick={() => getMedicalHistory()}
          />
          {medicalHistoryList.length > 0 && (
            <Table headers={medicalHeaders} data={medicalHistoryList} />
          )}
          <div></div>
          <Button
            label="Get Surgical History"
            onClick={() => getSurgicalHistory()}
          />
          {surgicalHistoryList.length > 0 && (
            <Table headers={surgicalHeaders} data={surgicalHistoryList} />
          )}
          <div></div>
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

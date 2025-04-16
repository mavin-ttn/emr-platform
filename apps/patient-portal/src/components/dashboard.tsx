import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';

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
}

function Dashboard() {
  const [patient, setPatient] = useState<PatientInfo | null>(null);

  useEffect(() => {
    const fetchPatient = async () => {
      const token = localStorage.getItem('access_token');
      const patientId = localStorage.getItem('patient_id');

      if (!token) {
        console.warn('No access token found!');
        return;
      }

      try {
        const response = await axios.get(
          `https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4/Patient/${patientId}`,
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
          (t: any) => t.system === 'phone'
        );
        const telecomEmail = data.telecom?.find(
          (t: any) => t.system === 'email'
        );

        setPatient({
          name:
            nameEntry.text ||
            `${nameEntry.given?.join(' ')} ${nameEntry.family}`,
          gender: data.gender,
          birthDate: data.birthDate,
          address: addressEntry.line?.join(', ') + ', ' + addressEntry.city,
          phone: telecomPhone?.value || '',
          email: telecomEmail?.value || '',
          maritalStatus: data.maritalStatus?.text || 'N/A',
          language: data.communication?.[0]?.language?.text || 'N/A',
          practitioner: data.generalPractitioner?.[0]?.display || 'N/A',
          organization: data.managingOrganization?.display || 'N/A',
        });
      } catch (err) {
        console.error('Failed to fetch patient data:', err);
      }
    };

    fetchPatient();
  }, []);

  return (
    <>
      <h1>Welcome to dashboard</h1>
      {patient && (
        <div>
          <p>
            <strong>Name:</strong> {patient.name}
          </p>
          <p>
            <strong>Gender:</strong> {patient.gender}
          </p>
          <p>
            <strong>DOB:</strong> {patient.birthDate}
          </p>
          <p>
            <strong>Address:</strong> {patient.address}
          </p>
          <p>
            <strong>Phone:</strong> {patient.phone}
          </p>
          <p>
            <strong>Email:</strong> {patient.email}
          </p>
          <p>
            <strong>Marital Status:</strong> {patient.maritalStatus}
          </p>
          <p>
            <strong>Language:</strong> {patient.language}
          </p>
          <p>
            <strong>Practitioner:</strong> {patient.practitioner}
          </p>
          <p>
            <strong>Organization:</strong> {patient.organization}
          </p>
        </div>
      )}
    </>
  );
}

export default Dashboard;

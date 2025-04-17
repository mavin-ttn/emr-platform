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
    const handleCreatePatient = async () => {
      const token = localStorage.getItem('access_token');

      if (!token) {
        console.warn('Access token not found');
        return;
      }

      const patientData = {
        resourceType: 'Patient',
        name: [
          {
            use: 'official',
            family: 'Doe',
            given: ['John'],
          },
        ],
        gender: 'male',
        birthDate: '1990-01-01',
        identifier: [
          {
            system: 'urn:oid:2.16.840.1.113883.4.1',
            value: '999-91-1234',
          },
        ],
      };

      try {
        const response = await fetch(
          'https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4/Patient',
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/fhir+json',
              Accept: 'application/fhir+json',
            },
            body: JSON.stringify(patientData),
          }
        );

        const result = await response.json();

        if (!response.ok) {
          console.error('Failed to create patient:', result);
        } else {
          console.log('Patient created successfully:', result);
        }
      } catch (error) {
        console.error('Error creating patient:', error);
      }
    };

    const fetchPatient = async () => {
      const token = localStorage.getItem('access_token');
      const patientId =
        localStorage.getItem('patient_id') || 'erXuFYUfucBZaryVksYEcMg3';

      if (!token) {
        console.warn('No access token found!');
        return;
      }

      try {
        const response = await axios.get(
          `https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4/Practitioner/e3MBXCOmcoLKl7ayLD51AWA3`,
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
    handleCreatePatient();
  }, []);

  if (!patient)
    return <div className="text-center mt-20">Loading patient info...</div>;

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">Patient Dashboard</h1>
      <div className="card-grid">
        {Object.entries(patient).map(([key, value]) => (
          <div key={key} className="card">
            <p className="card-label">{key.replace(/([A-Z])/g, ' $1')}</p>
            <p className="card-value">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;

// CreatePatient.tsx
import React, { useState } from 'react';
import Button from './Button';

const CreatePatient = () => {
  const [status, setStatus] = useState<string | null>(null);

  const handleCreatePatient = async () => {
    const token = localStorage.getItem('access_token');
    debugger;
    if (!token) {
      setStatus('Access token not found');
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
        setStatus(`Failed to create patient: ${JSON.stringify(result)}`);
      } else {
        setStatus('Patient created successfully!');
        console.log('Created patient:', result);
      }
    } catch (error) {
      setStatus(`Error: ${error}`);
    }
  };

  return (
    <div className="create-patient p-4 border rounded shadow max-w-md mx-auto my-6">
      <Button label="Create Patient" onClick={() => handleCreatePatient()} />
      {status && <p className="mt-4 text-sm text-gray-700">{status}</p>}
    </div>
  );
};

export default CreatePatient;

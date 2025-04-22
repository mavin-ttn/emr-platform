import React, { useState } from 'react';
import Button from './Button';

const CreatePatient = () => {
<<<<<<< HEAD
=======
  const [status, setStatus] = useState<string | null>(null);
>>>>>>> a2ce831 (ui for create patient done)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [notificationType, setNotificationType] = useState('success');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    gender: 'male',
    birthDate: '',
  });

  const generateFakeSSN = () => {
    const random = () => Math.floor(100 + Math.random() * 900);
    return `${random()}-${Math.floor(10 + Math.random() * 90)}-${Math.floor(
      1000 + Math.random() * 9000
    )}`;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreatePatient = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setNotification('Access token not found');
      return;
    }

    const ssn = generateFakeSSN();
    const patientData = {
      resourceType: 'Patient',
      name: [
        {
          use: 'official',
          family: formData.lastName,
          given: [formData.firstName],
        },
      ],
      gender: formData.gender,
      birthDate: formData.birthDate,
      identifier: [
        {
          system: 'urn:oid:2.16.840.1.113883.4.1',
          value: ssn,
        },
      ],
    };

    try {
      setIsLoading(true);
<<<<<<< HEAD
      const response = await fetch('http://localhost:3007/v2/patient/create', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(patientData),
      });
=======
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
>>>>>>> a2ce831 (ui for create patient done)

      console.log(response.status, 'create api response');
      if (response.status === 201) {
        setIsModalOpen(false);
        setNotification(`Patient created successfully with SSN: ${ssn}`);
        setTimeout(() => setNotification(null), 5000);
        setFormData({
          firstName: '',
          lastName: '',
          gender: 'male',
          birthDate: '',
        });
      } else {
        setNotificationType('error');
        setNotification(`❌ Failed to create patient`);
        setTimeout(() => setNotification(null), 5000);
      }
    } catch (error) {
      setNotificationType('error');
      setNotification(`⚠️ Error: ${error}`);
      setTimeout(() => setNotification(null), 5000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {notification && (
        <div className={`notification ${notificationType}`}>{notification}</div>
      )}

      <Button label="Create Patient" onClick={() => setIsModalOpen(true)} />

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-container">
            <h2 className="modal-title">Create New Patient</h2>

            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="First Name"
              className="modal-input"
            />
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Last Name"
              className="modal-input"
            />

            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="modal-input"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>

            <input
              type="date"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
              className="modal-input"
            />

            <div className="modal-actions">
              <button
                className="modal-button cancel"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="modal-button submit"
                onClick={handleCreatePatient}
                disabled={isLoading}
              >
                {isLoading ? 'Creating...' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatePatient;

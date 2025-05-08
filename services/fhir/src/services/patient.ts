import axios from "axios";

export const getPatientDetails = async (
  userId: string,
  authHeader: string
): Promise<any> => {
  const baseURL = `https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4/Patient/${userId}`;
  try {
    const response = await axios.get(baseURL, {
      headers: {
        Authorization: `${authHeader}`, // Replace with actual token
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error fetching patient details:", error.message);
    throw new Error("Failed to fetch patient details");
  }
};

export const getPatientSurgicalHistory = async (
  patientId: string,
  authHeader: string
): Promise<any> => {
  try {
    const baseURL = `https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4/Procedure?patient=${patientId}`;
    const response = await axios.get(baseURL, {
      headers: {
        Authorization: `${authHeader}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error fetching patient Surgical history:", error.message);
    throw new Error("Failed to fetch patient Surgical history");
  }
};

export const getPatientMedicalHistory = async (
  patientId: string,
  authHeader: string
): Promise<any> => {
  try {
    const baseURL = `https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4/Condition?patient=${patientId}`;
    const response = await axios.get(baseURL, {
      headers: {
        Authorization: `${authHeader}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error fetching patient Medical history:", error.message);
    throw new Error("Failed to fetch patient Medical history");
  }
};

export const getPatientSocialHistory = async (
  patientId: string,
  authHeader: string
): Promise<any> => {
  try {
    const baseURL = `https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4/Observation?patient=${patientId}&category=social-history`;
    const response = await axios.get(baseURL, {
      headers: {
        Authorization: `${authHeader}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error fetching patient Social history:", error.message);
    throw new Error("Failed to fetch patient Social history");
  }
};

/**
 * Fetch medication requests for a patient
 * @param patientId - The ID of the patient
 */
export const getMedicationRequests = async (
  patientId: string,
  authHeader: string
): Promise<any> => {
  const baseURL = `https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4/MedicationRequest?patient=${patientId}`;
  try {
    const response = await axios.get(baseURL, {
      headers: {
        Authorization: `${authHeader}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error fetching medication requests:", error.message);
    throw new Error("Failed to fetch medication requests");
  }
};

export const createPatient = async (
  patientData: string,
  authHeader: string
): Promise<any> => {
  const baseURL =
    "https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4/Patient";
  try {
    const response = await axios.post(baseURL, patientData, {
      method: "POST",
      headers: {
        Authorization: `${authHeader}`,
        "Content-Type": "application/fhir+json",
        Accept: "application/fhir+json",
      },
    });
    return response.data;
  } catch (error: any) {
    console.error(
      "Error fetching patient details:",
      error.response?.data || error.message
    );
    throw new Error("Failed to fetch patient details");
  }
};

export const findPatientAppointments = async (
  authHeader: string,
  startDate: string,
  endDate: string
): Promise<any> => {
  const baseURL =
    "https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/STU3/Appointment/$find";
  try {
    console.log("authHeader - >", startDate, endDate);
    const response = await axios.post(
      baseURL,
      {
        resourceType: "Parameters",
        parameter: [
          {
            name: "startTime",
            valueDateTime: startDate,
          },
          {
            name: "endTime",
            valueDateTime: endDate,
          },
        ],
      },
      {
        headers: {
          Authorization: `${authHeader}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error("Error fetching patient appointments:", error);
    throw new Error("Failed to fetch patient appointments");
  }
};

export const bookPatientAppointment = async (
  authHeader: string,
  patientId: string,
  appointmentId: string,
  appointmentNote: string
): Promise<any> => {
  const baseURL =
    "https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/STU3/Appointment/$book";
  try {
    const response = await axios.post(
      baseURL,
      {
        resourceType: "Parameters",
        parameter: [
          {
            name: "patient",
            valueIdentifier: {
              value: patientId,
            },
          },
          {
            name: "appointment",
            valueIdentifier: {
              value: appointmentId,
            },
          },
          {
            name: "appointmentNote",
            valueString: appointmentNote,
          },
        ],
      },
      {
        headers: {
          Authorization: `${authHeader}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error("Error creating patient appointment:", error);
    throw new Error("Failed to create patient appointment");
  }
};

export const getPatientAppointments = async (
  authHeader: string,
  patientId: string
): Promise<any> => {
  const baseURL =
    `https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/STU3/Appointment?patient=${patientId}`;
  try {
    const response = await axios.get(baseURL, {
      headers: {
        Authorization: `${authHeader}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error fetching patient appointments:", error);
    throw new Error("Failed to fetching patient appointments");
  }
};


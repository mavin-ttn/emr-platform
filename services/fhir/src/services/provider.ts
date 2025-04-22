import axios from 'axios';

export const getPractitionerDetails = async (userId: string, authHeader: string): Promise<any> => {
  const baseURL = `https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4/Practitioner/${userId}`;
  try {
    const response = await axios.get(baseURL, {
      headers: {
        Authorization: `${authHeader}`, // Replace with actual token
      },
    });
    return response.data;
  } catch (error: any) {
    console.error('Error fetching patient details:', error.message);
    throw new Error('Failed to fetch patient details');
  }
};

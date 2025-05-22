import axios from 'axios';

export const getPractitionerDetails = async (
  userId: string,
  authHeader: string,
  provider: string
): Promise<any> => {
  const baseURL =
    provider === 'cerner'
      ? `https://fhir-open.cerner.com/r4/ec2458f2-1e24-41c8-b71b-0e701af7583d/Practitioner/12742069`
      : `https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4/Practitioner/${userId}`;
  try {
    console.log(authHeader);
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

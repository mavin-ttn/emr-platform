import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import ROLE from '../constants/index';

function Callback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const accessToken = searchParams.get('access_token');
    const patientId =
      searchParams.get('patient') === 'undefined'
        ? undefined
        : searchParams.get('patient');
    //let userRole = patientId ? ROLE.PATIENT : ROLE.PRACTITIONER;
    let userRole = localStorage.getItem('role') || '';
    localStorage.setItem('userRole', userRole);
    if (!accessToken) {
      alert('Authorization failed. No access token received.');
      return;
    }

    const decodedToken = jwtDecode(accessToken);

    console.log(decodedToken, 'decodedagam');

    //For Cerner "iss": "https://authorization.cerner.com/"
    const fhirUser =
      decodedToken['urn:cerner:authorization:claims:version:1']?.profiles?.[
        'smart-v1'
      ]?.fhirUser;
    const tenant =
      decodedToken['urn:cerner:authorization:claims:version:1']?.tenant;

    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('patient_id', patientId);
    localStorage.setItem('id', decodedToken.sub || fhirUser.split('/')[1]);
    localStorage.setItem('fhirUser', fhirUser);
    localStorage.setItem('tenant', tenant);

    // Redirect user to their dashboard or any other page
    navigate('/dashboard');
  }, []);

  return <div>Completing login...</div>;
}

export default Callback;

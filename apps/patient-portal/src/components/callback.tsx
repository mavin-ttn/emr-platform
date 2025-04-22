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
    let userRole = patientId ? ROLE.PATIENT : ROLE.PRACTITIONER;
    localStorage.setItem('userRole', userRole);
    if (!accessToken) {
      alert('Authorization failed. No access token received.');
      return;
    }

    const decodedToken = jwtDecode(accessToken);

    console.log(decodedToken, 'decodedagam');

    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('patient_id', patientId);
    localStorage.setItem('id', decodedToken.sub);

    // Redirect user to their dashboard or any other page
    navigate('/dashboard');
  }, []);

  return <div>Completing login...</div>;
}

export default Callback;

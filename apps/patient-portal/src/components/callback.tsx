import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

function Callback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const accessToken = searchParams.get('access_token');
  const patientId = searchParams.get('patient') || '';

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    // const accessToken = queryParams.get('access_token');
    // const patientId = queryParams.get('patient') || '';
    const accessToken = searchParams.get('access_token');
    const patientId = searchParams.get('patient') || '';
    if (!accessToken) {
      alert('Authorization failed. No access token received.');
      return;
    }

    // Store the access token in localStorage
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('patient_id', patientId);

    // Redirect user to their dashboard or any other page
    navigate('/dashboard');
  }, []);

  return <div>Completing login...</div>;
}

export default Callback;

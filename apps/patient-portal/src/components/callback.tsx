import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Callback() {
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const accessToken = queryParams.get('access_token');

    if (!accessToken) {
      alert('Authorization failed. No access token received.');
      return;
    }

    // Store the access token in localStorage
    localStorage.setItem('access_token', accessToken);

    // Redirect user to their dashboard or any other page
    navigate('/dashboard');
  }, []);

  return <><p>Completing login...</p></>;
}

export default Callback;

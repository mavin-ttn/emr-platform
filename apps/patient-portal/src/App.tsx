import { useState } from 'react';
import './App.css';
import Button from './components/Button';
import ROLE from './constants/index';

function App() {
  const handleLogin = (role, provider) => {
    // role can be 'patient' or 'practitioner'
    //const provider = 'epic'; // or 'CERNER', etc. Dynamically set this if needed
    const url = `http://localhost:3000/auth/standalone/${provider}?role=${role}`;
    window.location.href = url;
  };

  return (
    <>
      <div className="app-container">
        <h1 className="app-title">SMART on FHIR Login</h1>
        <div className="button-group">
          <Button
            label="Login as Patient"
            onClick={() => handleLogin(ROLE.PATIENT, 'epic')}
          />
          <Button
            label="Login as Provider"
            onClick={() => handleLogin(ROLE.PRACTITIONER, 'epic')}
          />
        </div>
      </div>
    </>
  );
}

export default App;

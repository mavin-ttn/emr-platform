import { useState } from 'react';
import './App.css';

function App() {
  const handleLogin = (role) => {
    // role can be 'patient' or 'provider'
    const url = `http://localhost:3000/auth/standalone?role=${role}`;
    window.location.href = url;
  };

  return (
    <>
      <h1>Smart on FHIR Login</h1>

      <button
        onClick={() => handleLogin('patient')}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: '#007aff',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        Login as Patient
      </button>

      <button
        onClick={() => handleLogin('provider')}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: '#007aff',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        Login as Provider
      </button>
    </>
  );
}

export default App;

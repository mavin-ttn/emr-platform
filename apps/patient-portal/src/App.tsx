import { useState } from 'react';
import './App.css';

function App() {
  const handleLogin = () => {
    window.location.href = 'http://localhost:3000/auth/standalone';
  };

  return (
    <>
      <h1>Smart on FHIR Login</h1>
      <button
        onClick={handleLogin}
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
        Login with FHIR
      </button>
    </>
  );
}

export default App;

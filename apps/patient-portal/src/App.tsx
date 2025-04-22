import { useState } from 'react';
import './App.css';
import Button from './components/Button';

function App() {
  const handleLogin = (role) => {
    // role can be 'patient' or 'provider'
    const url = `http://localhost:3000/auth/standalone?role=${role}`;
    window.location.href = url;
  };

  const handleEmbeddedLogin = () => {
    const url = `http://localhost:3000/auth/embeddedLaunch`;
    window.location.href = url;
  };

  return (
    <>
      <div className="app-container">
        <h1 className="app-title">SMART on FHIR Login</h1>
        <div className="button-group">
          <Button
            label="Login as Patient"
            onClick={() => handleLogin('patient')}
          />
          <Button
            label="Login as Provider"
            onClick={() => handleLogin('provider')}
          />
          <Button
            label="Login as Embedded App"
            onClick={() => handleEmbeddedLogin()}
          />
        </div>
      </div>
    </>
  );
}

export default App;

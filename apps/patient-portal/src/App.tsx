import './App.css';
import Button from './components/Button';
import { ROLE } from './constants';

function App() {
  const handleLogin = (role: string, provider: string) => {
    // role can be 'patient' or 'practitioner'
    // provider can be 'epic' or 'cerner', etc.
    // type can be 'r4' or 'stu3'
    const url = `http://localhost:3000/auth/standalone/${provider}?role=${role}`;
    window.location.href = url;
  };

  return (
    <>
      <div className="app-container">
        <h1 className="app-title">SMART on FHIR Login</h1>
        <div className="button-group">
          <Button
            label="Login as Epic Patient"
            onClick={() => handleLogin(ROLE.PATIENT, 'epic')}
          />
          <Button
            label="Login as Epic Provider"
            onClick={() => handleLogin(ROLE.PRACTITIONER, 'epic')}
          />
          <Button
            label="Login as Epic Provider (STU3)"
            onClick={() => handleLogin(ROLE.PRACTITIONER_STU3, 'epic')}
          />
          <Button
            label="Login as Cerner Patient"
            onClick={() => handleLogin(ROLE.PATIENT, 'cerner')}
          />
          <Button
            label="Login as Cerner Provider"
            onClick={() => handleLogin(ROLE.PRACTITIONER, 'cerner')}
          />
        </div>
      </div>
    </>
  );
}

export default App;

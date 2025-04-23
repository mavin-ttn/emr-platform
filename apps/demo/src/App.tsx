import './App.css';
import Button from './components/Button';
import { useNavigate } from 'react-router-dom';

function App() {
  const navigate = useNavigate();

  return (
    <>
      <div className="app-container">
        <h1 className="app-title">Features</h1>
        <div className="button-group">
          <Button
            label="Transform Data"
            onClick={() => navigate('/transformer')}
          />
        </div>
      </div>
    </>
  );
}

export default App;

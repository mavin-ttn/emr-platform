import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';

function TransformPage() {
    const navigate = useNavigate();

    return (
        <>
            <div className="app-container">
                <h1 className="app-title">Transform Data</h1>
                <div className="button-group">
                    <Button
                        label="HL7 to FHIR"
                        onClick={() => navigate('/transformer/hl7/to/json')}
                    />
                    <Button
                        label="XML to FHIR"
                        onClick={() => navigate('/transformer/xml/to/json')}
                    />
                </div>
            </div>
        </>
    );
}

export default TransformPage;

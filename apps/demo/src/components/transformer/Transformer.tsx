import axios from "axios";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { TRANSFORMER_API_URL, SAMPLE_HL7_DATA, SAMPLE_XML_DATA } from "../../global/constant";
import PatientDashboardHL7 from "./PatientDetails"
import { PatientData } from "../../types/transformer";
import "../../static/css/transformer.css";
import { useNavigate } from 'react-router-dom';

const Transformer = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<string>("");
  const [transformedData, setTransformedData] = useState<PatientData | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [viewType, setViewType] = useState<"formatted" | "rawJson">(
    "formatted"
  );

  const { fromType, toType } = useParams();

  const handleHL7TransformData = async () => {
    try {
      setLoading(true);
      const res = await axios.post(`${TRANSFORMER_API_URL}/hl7/hl7-to-json`, {
        hl7Message: data,
      });
      console.log("Response data:", res.data);
      setTransformedData(res.data);
    } catch (error) {
      console.error("Error transforming data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleXMLTransformData = async () => {
    try {
      setLoading(true);
      const res = await axios.post(`${TRANSFORMER_API_URL}/xml/xml-to-json`, {
        xmlMessage: data,
      });
      console.log("Response data:", res.data);
      setTransformedData(res.data);
    } catch (error) {
      console.error("Error transforming data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadSampleData = () => {
    setData(fromType === 'hl7' ? SAMPLE_HL7_DATA : SAMPLE_XML_DATA);
  };

  return (
    <div className="transformer-container">
      <div className="transformer-header">
        <h1>
          <button
            className="sample-button"
            onClick={() => navigate('/transformer')}
          >
            Back
          </button>
          &nbsp;{fromType?.toUpperCase()} Data Transformer</h1>
      </div>

      <div className="transformation-type">
        <div className="from-type">{fromType?.toUpperCase()}</div>
        <div className="arrow-icon">
          <span className="arrow">→</span>
        </div>
        <div className="to-type">{toType?.toUpperCase()}</div>
      </div>

      <div className="input-section">
        <div className="input-header">
          <h2>Input {fromType?.toUpperCase()} Data</h2>
          <div className="sample-buttons">
            <button
              className="sample-button"
              onClick={() => handleLoadSampleData()}
            >
              Load Sample Data
            </button>
            <button className="clear-button" onClick={() => setData("")}>
              Clear
            </button>
          </div>
        </div>
        <textarea
          className="hl7-textarea"
          value={data}
          onChange={(e) => setData(e.target.value)}
          placeholder={`Paste your ${fromType?.toUpperCase()} data here...`}
        ></textarea>

        <button
          className={`transform-button ${loading ? "loading" : ""}`}
          onClick={fromType === 'hl7' ? handleHL7TransformData : handleXMLTransformData}
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner"></span>
              Transforming...
            </>
          ) : (
            <>Transform Data</>
          )}
        </button>
      </div>

      {transformedData && (
        <div className="result-section">
          <h2>Transformation Result</h2>
          <div className="result-tabs">
            <button
              className={`tab ${viewType === "formatted" ? "active" : ""}`}
              onClick={() => setViewType("formatted")}
            >
              Formatted View
            </button>
            <button
              className={`tab ${viewType === "rawJson" ? "active" : ""}`}
              onClick={() => setViewType("rawJson")}
            >
              Raw JSON
            </button>
          </div>
          <div className="result-content">
            {viewType === "rawJson" ? (
              <pre className="json-output">
                {JSON.stringify(transformedData, null, 2)}
              </pre>
            ) : (
              <div className="formatted-output">
                <PatientDashboardHL7 patientData={transformedData} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Transformer;

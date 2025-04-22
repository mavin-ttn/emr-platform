import axios from "axios";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { TRANSFORMER_API_URL } from "../global/constant/url";
import PatientDashboard from "../components/transformer/PatientDetails";
import { PatientData } from "../types/transformer";
import "../static/css/transformer.css";

const Transformer = () => {
  const [hl7Data, setHl7Data] = useState<string>("");
  const [transformedData, setTransformedData] = useState<PatientData | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [viewType, setViewType] = useState<"formatted" | "rawJson">(
    "formatted"
  );

  const sampleHl7Data = `MSH|^~\&|SENDING_APP|SENDING_FACILITY|RECEIVING_APP|RECEIVING_FACILITY|20230615112535||ADT^A01|MSG00001|P|2.5.1|||AL|NE|USA
EVN|A01|20230615112535|||OPERATOR1^SMITH^JOHN^^^^
PID|1||12345678^^^MRN^MR||DOE^JOHN^M^^^^||19800101|M||W|123 MAIN ST^^ANYTOWN^CA^90210^USA||555-555-1234^PRN^PH^^^555^5551234~555-555-5678^PRN^CP^^^555^5555678||ENG|M|CHR|123456789|987-65-4321|||N||||20230615
NK1|1|DOE^JANE^^^^^|SPO|555-555-4321^^PH^^^555^5554321||EC|||||||||F
PV1|1|I|WEST^2^3^GENERAL HOSPITAL^^N^^^^^|E|||001234^ATTENDING^DOCTOR^A^^^^^GENMED|002345^REFERRING^DOCTOR^B^^^^^GENMED||SUR|||||ADM|A0|||||||||||||||||||||||||20230615112300|20230616
OBX|1|NM|HEIGHT^HEIGHT||180|cm|||||F
OBX|2|NM|WEIGHT^WEIGHT||75|kg|||||F
OBX|3|TX|COMMENT^COMMENTS||THE PATIENT HAS REPORTED CHEST PAIN FOR THE PAST 2 DAYS||||||F
AL1|1|DA|PENICILLIN^PENICILLIN^ANTIBIOTIC|MO|RASH|20150610
DG1|1|ICD10|I21.3|ACUTE MYOCARDIAL INFARCTION|20230615090000|A||||||||||002345^REFERRING^DOCTOR^B^^^^^GENMED|||||||||1
GT1|1|12345678|DOE^JOHN^M^^^^|DOE^JOHN^M^^^^|123 MAIN ST^^ANYTOWN^CA^90210^USA|555-555-1234||19800101|M|P/F|SLF|987-65-4321||||ANYTOWN COMPANY|456 WORK ST^^ANYTOWN^CA^90210^USA|555-555-9012|||||||||||||||||||||||||||||ANYTOWN INSURANCE COMPANY|GROUP123|PLAN456
IN1|1|PLAN123|INSURANCE123|ANYTOWN INSURANCE COMPANY|789 INSURANCE ST^^ANYTOWN^CA^90210^USA|||||||||GROUP123|DOE^JOHN^M^^^^|SLF|19800101|123 MAIN ST^^ANYTOWN^CA^90210^USA|||1||||||||||||||987654321|||||||||M|`;

  const { fromType, toType } = useParams();

  const handleTransformData = async () => {
    try {
      setLoading(true);
      const res = await axios.post(`${TRANSFORMER_API_URL}/hl7-to-json`, {
        hl7Message: hl7Data,
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
    setHl7Data(sampleHl7Data);
  };

  return (
    <div className="transformer-container">
      <div className="transformer-header">
        <h1>HL7 Data Transformer</h1>
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
            <button className="clear-button" onClick={() => setHl7Data("")}>
              Clear
            </button>
          </div>
        </div>
        <textarea
          className="hl7-textarea"
          value={hl7Data}
          onChange={(e) => setHl7Data(e.target.value)}
          placeholder={`Paste your ${fromType?.toUpperCase()} data here...`}
        ></textarea>

        <button
          className={`transform-button ${loading ? "loading" : ""}`}
          onClick={handleTransformData}
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
                <PatientDashboard patientData={transformedData} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Transformer;

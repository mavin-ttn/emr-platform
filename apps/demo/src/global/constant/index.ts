export const TRANSFORMER_API_URL = "http://localhost:3002";

export const SAMPLE_HL7_DATA = `MSH|^~\&|SENDING_APP|SENDING_FACILITY|RECEIVING_APP|RECEIVING_FACILITY|20230615112535||ADT^A01|MSG00001|P|2.5.1|||AL|NE|USA
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


export const SAMPLE_XML_DATA = `<MedicalMessage>
<MessageHeader>
  <MessageId>MSG00001</MessageId>
  <MessageType>ADT^A01</MessageType>
  <Timestamp>20230615112535</Timestamp>
</MessageHeader>

<Patient>
  <MRN>12345678</MRN>
  <Name>
    <FirstName>JOHN</FirstName>
    <LastName>DOE</LastName>
  </Name>
  <DOB>19800101</DOB>
  <Gender>M</Gender>
  <Address>
    <Street>123 MAIN ST</Street>
    <City>ANYTOWN</City>
    <State>CA</State>
    <Zip>90210</Zip>
  </Address>
  <Phones>
    <Phone>
      <Number>5555551234</Number>
      <Type>PRN</Type>
      <Use>PH</Use>
    </Phone>
    <Phone>
      <Number>5555555678</Number>
      <Type>PRN</Type>
      <Use>CP</Use>
    </Phone>
  </Phones>
</Patient>

<Visit>
  <VisitId></VisitId>
  <AdmissionDate></AdmissionDate>
  <Location>
    <Facility>WEST</Facility>
    <Department>2</Department>
  </Location>
  <AttendingPhysician>
    <ID>001234</ID>
    <Name>ATTENDING DOCTOR</Name>
  </AttendingPhysician>
</Visit>

<Observations>
  <Observation>
    <Type>HEIGHT</Type>
    <Value>180</Value>
    <Unit>cm</Unit>
    <Comment>HEIGHT</Comment>
  </Observation>
  <Observation>
    <Type>WEIGHT</Type>
    <Value>75</Value>
    <Unit>kg</Unit>
    <Comment>WEIGHT</Comment>
  </Observation>
  <Observation>
    <Type>COMMENT</Type>
    <Value>THE PATIENT HAS REPORTED CHEST PAIN FOR THE PAST 2 DAYS</Value>
    <Unit></Unit>
    <Comment>COMMENTS</Comment>
  </Observation>
</Observations>

<Allergies>
  <Allergy>
    <Substance>PENICILLIN</Substance>
    <Reaction>
      <AL1_5>
        <AL1_5_1>RASH</AL1_5_1>
      </AL1_5>
    </Reaction>
    <OnsetDate>
      <AL1_6>
        <AL1_6_1>20150610</AL1_6_1>
      </AL1_6>
    </OnsetDate>
  </Allergy>
</Allergies>

<Diagnosis>
  <DiagnosisEntry>
    <Code>I21.3</Code>
    <Description>
      <DG1_4>
        <DG1_4_1>ACUTE MYOCARDIAL INFARCTION</DG1_4_1>
      </DG1_4>
    </Description>
    <Date>
      <DG1_5>
        <DG1_5_1>20230615090000</DG1_5_1>
      </DG1_5>
    </Date>
  </DiagnosisEntry>
</Diagnosis>

<Insurance>
  <Company>
    <IN1_4>
      <IN1_4_1>ANYTOWN INSURANCE COMPANY</IN1_4_1>
    </IN1_4>
  </Company>
  <PlanId>
    <IN1_2>
      <IN1_2_1>PLAN123</IN1_2_1>
    </IN1_2>
  </PlanId>
  <GroupNumber></GroupNumber>
  <SubscriberId></SubscriberId>
</Insurance>
</MedicalMessage>

`
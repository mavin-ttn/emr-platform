# Mirth connect transformers

# hl7 to Fhir

// Parse the raw HL7 message into an E4X XML object
var hl7Message = new XML(connectorMessage.getTransformedData());

// Build JSON structure
var json = {
messageHeader: {
messageId: msg.MSH['MSH.10']['MSH.10.1'].toString(),
messageType: msg.MSH['MSH.9']['MSH.9.1'].toString() + '^' + msg.MSH['MSH.9']['MSH.9.2'].toString(),
timestamp: msg.MSH['MSH.7']['MSH.7.1'].toString()
},
patient: {
mrn: msg.PID['PID.3']['PID.3.1'].toString(),
name: {
firstName: msg.PID['PID.5']['PID.5.2'].toString(),
lastName: msg.PID['PID.5']['PID.5.1'].toString()
},
dob: msg.PID['PID.7']['PID.7.1'].toString(),
gender: msg.PID['PID.8']['PID.8.1'].toString(),
address: {
street: msg.PID['PID.11']['PID.11.1'].toString(),
city: msg.PID['PID.11']['PID.11.3'].toString(),
state: msg.PID['PID.11']['PID.11.4'].toString(),
zip: msg.PID['PID.11']['PID.11.5'].toString()
},
phones: []
},
visit: {
visitId: msg.PV1['PV1.19']['PV1.19.1'].toString(),
admissionDate: msg.PV1['PV1.44']['PV1.44.1'].toString(),
location: {
facility: msg.PV1['PV1.3']['PV1.3.1'].toString(),
department: msg.PV1['PV1.3']['PV1.3.2'].toString()
},
attendingPhysician: {
id: msg.PV1['PV1.7']['PV1.7.1'].toString(),
name: msg.PV1['PV1.7']['PV1.7.2'].toString() + ' ' + msg.PV1['PV1.7']['PV1.7.3'].toString()
}
},
observations: [],
allergies: [],
diagnosis: []
};

// Add Phone Numbers (PID-13)
for each (phone in msg.PID['PID.13']) {
json.patient.phones.push({
number: phone['PID.13.1'].toString().replace(/-/g, ''),
type: phone['PID.13.2'].toString(),
use: phone['PID.13.3'].toString()
});
}

// Add Observations (OBX)
for each (obx in msg.OBX) {
json.observations.push({
type: obx['OBX.3']['OBX.3.1'].toString(),
value: obx['OBX.5']['OBX.5.1'].toString(),
unit: obx['OBX.6']['OBX.6.1'].toString(),
comment: obx['OBX.3']['OBX.3.2'].toString()
});
}

// Add Allergies (AL1)
for each (al1 in msg.AL1) {
json.allergies.push({
substance: al1['AL1.3']['AL1.3.1'].toString(),
reaction: al1['AL1.5'].toString(),
onsetDate: al1['AL1.6'].toString()
});
}

// Add Diagnosis (DG1)
for each (dg1 in msg.DG1) {
json.diagnosis.push({
code: dg1['DG1.3']['DG1.3.1'].toString(),
description: dg1['DG1.4'].toString(),
date: dg1['DG1.5'].toString()
});
}

// Add Insurance (IN1)
if (msg.IN1.length() > 0) {
json.insurance = {
company: msg.IN1['IN1.4'].toString(),
planId: msg.IN1['IN1.2'].toString(),
groupNumber: msg.IN1['IN1.11'].toString(),
subscriberId: msg.IN1['IN1.36'].toString()
};
}

// Convert the JavaScript object to a JSON string
channelMap.put('jsonData', JSON.stringify(json));

# xml to Fhir

// XML to JSON Transformer for Mirth Connect with camelCase keys

// Get the XML content from the incoming message
var xmlInput = msg;

// Parse the XML string into an E4X XML object
var xml = new XML(xmlInput);

// Function to convert string to camelCase
function toCamelCase(str) {
return str.replace(/[-\_ ](.)/g, (_, group1) => group1.toUpperCase())
.replace(/^(.)/, (_, group1) => group1.toLowerCase());
}

// Function to convert XML to JSON object
function xmlToObject(xmlNode) {
var result = {};

    // Process attributes if they exist
    if (xmlNode.attributes().length() > 0) {
        result["@attributes"] = {};
        for each (var attr in xmlNode.attributes()) {
            var attrName = toCamelCase(attr.name().localName);
            result["@attributes"][attrName] = String(attr);
        }
    }

    // Process child elements
    var hasChildElements = false;

    for each (var child in xmlNode.children()) {
        if (child.nodeKind() == "element") {
            hasChildElements = true;
            var childName = toCamelCase(child.name().localName);

            var childValue = xmlToObject(child);

            if (result[childName] !== undefined) {
                if (!Array.isArray(result[childName])) {
                    result[childName] = [result[childName]];
                }
                result[childName].push(childValue);
            } else {
                result[childName] = childValue;
            }
        }
    }

    if (!hasChildElements && xmlNode.text().length() > 0) {
        var textValue = xmlNode.text().toString().trim();
        if (Object.keys(result).length == 0) {
            return textValue;
        } else {
            result["#text"] = textValue;
        }
    }

    return result;

}

function ensureArray(val) {
if (Array.isArray(val)) return val;
if (val == null) return [];
return [val];
}

function transformData(input) {
const mm = input && input.medicalMessage ? input.medicalMessage : {};

const header = mm.messageHeader || {};
const patient = mm.patient || {};
const patientName = patient.name || {};
const patientAddress = patient.address || {};
const phones = (patient.phones && patient.phones.phone) || [];

const visit = mm.visit || {};
const location = visit.location || {};
const attendingPhysician = visit.attendingPhysician || {};

const observations = (mm.observations && mm.observations.observation) || [];
const allergy = (mm.allergies && mm.allergies.allergy) || {};
const reaction = allergy.reaction || {};
const onsetDate = allergy.onsetDate || {};

const diagnosisEntry = (mm.diagnosis && mm.diagnosis.diagnosisEntry) || {};
const description = diagnosisEntry.description || {};
const diagnosisDate = diagnosisEntry.date || {};

const insurance = mm.insurance || {};
const company = insurance.company || {};
const planId = insurance.planId || {};

return {
messageHeader: {
messageId: header.messageId || "",
messageType: header.messageType || "",
timestamp: header.timestamp || "",
},
patient: {
mrn: patient.mRN || "",
name: {
firstName: patientName.firstName || "",
lastName: patientName.lastName || "",
},
dob: patient.dOB || "",
gender: patient.gender || "",
address: {
street: patientAddress.street || "",
city: patientAddress.city || "",
state: patientAddress.state || "",
zip: patientAddress.zip || "",
},
phones: ensureArray(phones).map(function (phone) {
return {
number: phone && phone.number || "",
type: phone && phone.type || "",
use: phone && phone.use || "",
};
}),
},
visit: {
visitId: "", // Assuming static value
admissionDate: "", // Assuming static value
location: {
facility: location.facility || "",
department: location.department || "",
},
attendingPhysician: {
id: attendingPhysician.iD || "",
name: attendingPhysician.name || "",
},
},
observations: ensureArray(observations).map(function (obs) {
return {
type: obs && obs.type || "",
value: obs && obs.value || "",
unit: obs && obs.unit || "",
comment: obs && obs.comment || "",
};
}),
allergies: [
{
substance: allergy.substance || "",
reaction: "<AL1.5><AL1.5.1>" + (reaction.aL15 && reaction.aL15.aL151 || "") + "</AL1.5.1></AL1.5>",
onsetDate: "<AL1.6><AL1.6.1>" + (onsetDate.aL16 && onsetDate.aL16.aL161 || "") + "</AL1.6.1></AL1.6>",
},
],
diagnosis: [
{
code: diagnosisEntry.code || "",
description: "<DG1.4><DG1.4.1>" + (description.dG14 && description.dG14.dG141 || "") + "</DG1.4.1></DG1.4>",
date: "<DG1.5><DG1.5.1>" + (diagnosisDate.dG15 && diagnosisDate.dG15.dG151 || "") + "</DG1.5.1></DG1.5>",
},
],
insurance: {
company: "<IN1.4><IN1.4.1>" + (company.iN14 && company.iN14.iN141 || "") + "</IN1.4.1></IN1.4>",
planId: "<IN1.2><IN1.2.1>" + (planId.iN12 && planId.iN12.iN121 || "") + "</IN1.2.1></IN1.2>",
groupNumber: "",
subscriberId: "",
},
};
}

try {
var jsonObj = {};
var rootName = toCamelCase(xml.name().localName);
jsonObj[rootName] = xmlToObject(xml);
var transformedData = transformData(jsonObj);

    var jsonString = JSON.stringify(transformedData, null, 2);
    channelMap.put('jsonData', jsonString);
    return jsonString;

} catch (e) {
var errorMsg = "Error converting XML to JSON: " + e.message;
logger.error(errorMsg);
return '{"error":"' + errorMsg.replace(/"/g, '\\"') + '"}';
}

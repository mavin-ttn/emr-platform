# erm-platform

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

try {
var jsonObj = {};
var rootName = toCamelCase(xml.name().localName);
jsonObj[rootName] = xmlToObject(xml);

    var jsonString = JSON.stringify(jsonObj, null, 2);
    channelMap.put('jsonData', jsonString);
    return jsonString;

} catch (e) {
var errorMsg = "Error converting XML to JSON: " + e.message;
logger.error(errorMsg);
return '{"error":"' + errorMsg.replace(/"/g, '\\"') + '"}';
}

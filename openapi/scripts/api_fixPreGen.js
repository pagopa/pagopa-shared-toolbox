const regexReplace = require('regex-replace');

regexReplace(
  /("format": *"uri",[\s]*"type": "string")/gi,
  '"$ref": "#/definitions/STRINGWrapper"',
  'openapi/generated/swagger20.json',
  { fileContentsOnly: true }
);
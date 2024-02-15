const regexReplace = require('regex-replace');

regexReplace(
  /("format": *"uri",[\s]*"type": "string")/gi,
  '"$ref": "#/definitions/STRINGWrapper"',
  `openapi/generated/${process.argv[2]}/swagger20.json`,
  { fileContentsOnly: true }
);
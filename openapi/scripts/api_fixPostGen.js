const regexReplace = require('regex-replace');

regexReplace(
  'readonly "bundle-type"\\?: array;',
  'readonly "bundle-type"?: Array<string>;',
  `src/api/generated/${process.argv[2]}/requestTypes.ts`,
  { fileContentsOnly: true }
);
/*
regexReplace(
  '"io-ts";',
  '"io-ts"; \n import { Buffer } from \'buffer\'; \n',
  'src/api/generated/requestTypes.ts',
  { fileContentsOnly: true }
);
*/
regexReplace(
  '"io-ts";',
  '"io-ts"; \n',
  `src/api/generated/${process.argv[2]}/requestTypes.ts`,
  { fileContentsOnly: true }
);
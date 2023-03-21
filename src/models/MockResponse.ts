import * as t from "io-ts";

// required attributes
const MockResponseR = t.interface({
  id: t.string,
  body: t.string,
  parameters: t.array(t.string, "array of string"),
  status: t.number,
  headers: t.any,
});

// optional attributes
const MockResponseO = t.partial({
});


export const MockResponse = t.intersection([MockResponseR, MockResponseO], "MockResponse");

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type MockResponse = t.TypeOf<typeof MockResponse>;

import * as t from "io-ts";
import { MockRule } from "./MockRule";

// required attributes
const MockResourceR = t.interface({
  id: t.string,
  name: t.string,
  resourceUrl: t.string,
  mockType: t.string,
  httpMethod: t.string,
  tag: t.array(t.string, "array of string"),
  rules: t.array(MockRule, "array of MockRule")
});

// optional attributes
const MockResourceO = t.partial({
});

export const MockResource = t.intersection([MockResourceR, MockResourceO], "MockResource");

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type MockResource = t.TypeOf<typeof MockResource>;

import * as t from "io-ts";
import { MockCondition } from "./MockCondition";
import { MockResponse } from "./MockResponse";

// required attributes
const MockRuleR = t.interface({
  id: t.string,
  name: t.string,
  tag: t.array(t.string, "array of string"),
  isActive: t.boolean,
  conditions: t.array(MockCondition, "array of MockCondition"),
  response: MockResponse,
});

// optional attributes
const MockRuleO = t.partial({
});

export const MockRule = t.intersection([MockRuleR, MockRuleO], "MockRule");

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type MockRule = t.TypeOf<typeof MockRule>;

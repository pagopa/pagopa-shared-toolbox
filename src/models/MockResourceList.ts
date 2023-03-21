import { PageInfo } from "./PageInfo";
import { MockResource } from "./MockResource";
import * as t from "io-ts";

// required attributes
const MockResourceR = t.interface({
  mockResources: t.readonlyArray(MockResource, "array of MockResource")
});

// optional attributes
const MockResourceO = t.partial({
  pageInfo: PageInfo
});

export const MockResources = t.intersection([MockResourceR, MockResourceO], "MockResources");

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type MockResources = t.TypeOf<typeof MockResources>;
import * as t from "io-ts";

// required attributes
const MockConditionR = t.interface({
  id: t.string,
  fieldPosition: t.string,
  analyzedContentType: t.string,
  fieldName: t.string,
  conditionType: t.string,
  conditionValue: t.string,
});

// optional attributes
const MockConditionO = t.partial({
});

export const MockCondition = t.intersection([MockConditionR, MockConditionO], "MockCondition");

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type MockCondition = t.TypeOf<typeof MockCondition>;

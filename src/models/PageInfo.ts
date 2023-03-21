import * as t from "io-ts";

// required attributes
const PageInfoR = t.interface({
  itemsFound: t.Integer,

  limit: t.Integer,

  page: t.Integer,

  totalPages: t.Integer
});

// optional attributes
const PageInfoO = t.partial({});

export const PageInfo = t.intersection([PageInfoR, PageInfoO], "PageInfo");

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type PageInfo = t.TypeOf<typeof PageInfo>;

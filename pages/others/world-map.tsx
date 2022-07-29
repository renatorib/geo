import React from "react";

import { WorldMap, NoSSR } from "~/components";
import { countries } from "~/countries";

const Page = () => {
  return <NoSSR>{() => <WorldMap countries={countries.filter((c) => c.shape != null)} />}</NoSSR>;
};

export default Page;

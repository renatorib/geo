import React from "react";

import { WorldMap } from "~/components";
import { countries } from "~/countries";

const Page = () => {
  return <WorldMap countries={countries.filter((c) => c.shape != null)} />;
};

export default Page;

import React from "react";

import { DisplayProps } from "~/data-sources";
import { Country } from "~/data-sources/countries";

import { BaseDisplay } from "./BaseDisplay";

export const DomainsDisplay = ({ data, status }: DisplayProps<Country>) => {
  return <BaseDisplay status={status} value={data.domain} />;
};

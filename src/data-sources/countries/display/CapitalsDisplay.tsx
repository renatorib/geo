import React from "react";

import { DisplayProps } from "~/data-sources";
import { Country } from "~/data-sources/countries";
import { useSettings } from "~/features/settings";

import { BaseDisplay } from "./BaseDisplay";

export const CapitalsDisplay = ({ data, status }: DisplayProps<Country>) => {
  const { lang } = useSettings();
  return <BaseDisplay status={status} value={data.capital[lang.property]} valueEn={data.capital.en} />;
};

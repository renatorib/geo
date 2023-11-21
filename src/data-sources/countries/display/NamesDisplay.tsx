import React from "react";

import { DisplayProps } from "~/data-sources";
import { Country } from "~/data-sources/countries";
import { useSettings } from "~/features/settings";

import { BaseDisplay } from "./BaseDisplay";

export const NamesDisplay = ({ data, status }: DisplayProps<Country>) => {
  const { lang } = useSettings();
  return <BaseDisplay status={status} value={data.name[lang.property]} valueEn={data.name.en} />;
};

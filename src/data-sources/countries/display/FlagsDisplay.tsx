import NextImage from "next/image";
import React from "react";

import { DisplayProps } from "~/data-sources";
import { Country } from "~/data-sources/countries";
import { useSettings } from "~/features/settings";

import { BaseDisplay } from "./BaseDisplay";

export const FlagsDisplay = ({ data, status }: DisplayProps<Country>) => {
  const { lang } = useSettings();
  const name = data.name[lang.property];

  return (
    <BaseDisplay
      ratio={45 / 30}
      status={status}
      value={
        data.flag && (
          <NextImage
            priority={true}
            src={data.flag}
            alt={status !== "hidden" ? `Flag of ${name}` : "Flag of unknown"}
            title={status !== "hidden" ? name : undefined}
            fill
            sizes="100vw"
            style={{
              objectFit: "contain",
            }}
          />
        )
      }
    />
  );
};

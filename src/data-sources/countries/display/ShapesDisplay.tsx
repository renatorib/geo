import React from "react";

import { AspectRatio, Text, useMantineTheme } from "@mantine/core";

import { DisplayProps } from "~/data-sources";
import { Country } from "~/data-sources/countries";
import { getViewboxOfPath } from "~/lib/svg";

export const ShapesDisplay = ({ data, status }: DisplayProps<Country>) => {
  const theme = useMantineTheme();

  const shapeViewbox = React.useMemo(() => {
    const vb = getViewboxOfPath(data.shape, { aspectRatio: 45 / 30, margin: 0.5 });
    const size = Math.max(vb.viewboxWidth, vb.viewboxHeight);
    return { viewbox: vb.viewbox, size: size };
  }, [data.shape]);

  return (
    <div>
      {data.shape && shapeViewbox.viewbox ? (
        <svg viewBox={shapeViewbox.viewbox} width="100%" height="100%">
          <path
            d={data.shape}
            stroke={status !== "hidden" ? theme.colors.green[7] : theme.colors.gray[5]}
            fill={status !== "hidden" ? theme.colors.green[4] : theme.colors.gray[3]}
            strokeWidth={shapeViewbox.size * 0.006}
          />
        </svg>
      ) : (
        <AspectRatio ratio={45 / 30} className="w-full">
          <div className="grid place-content-center w-full h-full">
            <Text c="red" size="xs">
              Country shape not found
            </Text>
          </div>
        </AspectRatio>
      )}
    </div>
  );
};

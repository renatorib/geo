import React from "react";

import { DisplayProps } from "~/data-sources";
import { Country } from "~/data-sources/countries";
import { cn } from "~/lib/styles";
import { getViewboxOfPath } from "~/lib/svg";

import { BaseDisplay } from "./BaseDisplay";

export const ShapesDisplay = ({ data, status }: DisplayProps<Country>) => {
  const shapeViewbox = React.useMemo(() => {
    const vb = getViewboxOfPath(data.shape, { aspectRatio: 45 / 30, margin: 0.1 });
    const size = Math.max(vb.viewboxWidth, vb.viewboxHeight);
    return { viewbox: vb.viewbox, size: size };
  }, [data.shape]);

  return (
    <BaseDisplay
      status={status}
      ratio={45 / 30}
      value={
        data.shape &&
        shapeViewbox.viewbox && (
          <svg viewBox={shapeViewbox.viewbox} width="100%" height="100%">
            <path
              d={data.shape}
              strokeWidth={shapeViewbox.size * 0.004}
              className={cn("stroke-context-700 fill-context-400")}
            />
          </svg>
        )
      }
    />
  );
};

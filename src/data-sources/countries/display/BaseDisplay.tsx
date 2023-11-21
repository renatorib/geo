import React from "react";

import { AspectRatio } from "~/components/ui/AspectRatio";
import { cn, contextColors } from "~/lib/styles";

type BaseDisplayProps = {
  status: "correct" | "spoiler" | "hidden";
  value: React.ReactNode;
  valueEn?: string;
  ratio?: number;
};

export const BaseDisplay = ({ status, ratio = 5 / 2, value, valueEn }: BaseDisplayProps) => {
  const color = status === "correct" ? "green" : status === "spoiler" ? "red" : "slate";

  return (
    <div className={cn(contextColors[color])}>
      {value ? (
        <AspectRatio ratio={ratio} className="w-full">
          {typeof value === "string" ? (
            <div className="grid place-items-center h-full">
              <div>
                <div className={cn("font-bold text-lg text-center text-context-800")}>{value}</div>
                {valueEn && value !== valueEn && (
                  <div style={{ opacity: 0.5, fontSize: 14 }}>
                    <div className="text-center text-context-800">({valueEn})</div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            value
          )}
        </AspectRatio>
      ) : (
        <AspectRatio ratio={ratio} className="w-full">
          <div className="grid place-items-center">
            <div className="text-red-800 text-xs">?</div>
          </div>
        </AspectRatio>
      )}
    </div>
  );
};

import React from "react";

import { useIsMounted } from "~/hooks";

type NoSSRProps = {
  children: (() => React.ReactNode) | React.ReactNode;
  fallback?: React.ReactNode;
};

export const NoSSR = ({ children, fallback = null }: NoSSRProps) => (
  <>{useIsMounted() ? (typeof children === "function" ? children() : children) : fallback}</>
);

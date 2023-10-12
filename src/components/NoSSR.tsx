import React from "react";

import { useIsMounted } from "~/hooks";

export const NoSSR = ({
  children,
  fallback = null,
}: {
  children: () => React.ReactNode | JSX.Element;
  fallback?: React.ReactNode;
}) => {
  return <>{useIsMounted() ? children() : fallback}</>;
};

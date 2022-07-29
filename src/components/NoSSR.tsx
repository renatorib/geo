import React from "react";
import { useIsMounted } from "~/hooks";

export const NoSSR = ({ children }: { children: () => React.ReactNode | JSX.Element }) => {
  const isMounted = useIsMounted();
  return isMounted ? <>{children()}</> : null;
};

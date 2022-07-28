import React from "react";

export function useIsMounted() {
  const [isMounted, setIsMounted] = React.useState(false);
  React.useEffect(() => void setIsMounted(true), []);
  return isMounted;
}

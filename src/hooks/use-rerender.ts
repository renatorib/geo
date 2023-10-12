import React from "react";

export const useRerender = () => {
  const [, setRerender] = React.useState(0);
  return () => setRerender((v) => v + 1);
};

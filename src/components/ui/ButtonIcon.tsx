import React from "react";

import { Button } from "./Button";

type ButtonIconProps = Omit<React.ComponentProps<typeof Button>, "paddingSquare">;

export const ButtonIcon = React.forwardRef<React.ComponentRef<typeof Button>, ButtonIconProps>((props, ref) => {
  return <Button {...props} ref={ref} paddingSquare={true} />;
});

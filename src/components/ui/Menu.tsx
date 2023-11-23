import React from "react";

import * as Ariakit from "@ariakit/react";

import { fr } from "~/lib/react";
import { cn } from "~/lib/styles";

import { Button } from "./Button";

type MenuProps = {
  target: React.ReactElement | string;
  children?: React.ReactNode;
  className?: string;
};

export const Menu = (props: MenuProps) => {
  return (
    <Ariakit.PopoverProvider animated={true}>
      <Ariakit.PopoverAnchor>
        {typeof props.target === "string" ? (
          <Ariakit.PopoverDisclosure>{props.target}</Ariakit.PopoverDisclosure>
        ) : (
          <Ariakit.PopoverDisclosure render={props.target} />
        )}
      </Ariakit.PopoverAnchor>
      <Ariakit.Popover
        className={cn(
          "border border-slate-200 bg-white z-50",
          "p-3 rounded shadow-sm text-sm",
          "translate-y-2 data-[enter]:translate-y-0",
          "opacity-0 data-[enter]:opacity-100 transition",
          "flex flex-col gap-2",
          props.className,
        )}
      >
        <Ariakit.PopoverArrow />
        {props.children}
      </Ariakit.Popover>
    </Ariakit.PopoverProvider>
  );
};

const MenuLabel = fr((props, ref) => (
  <div ref={ref} {...props} className={cn("text-slate-400 font-semibold text-xs", props.className)} />
));

const MenuItem = fr<{ selected?: boolean }, typeof Button>(({ selected, ...props }, ref) => (
  <Button
    ref={ref}
    radius="sm"
    variant={selected ? "filled" : "ghost"}
    color={selected ? "blue" : "slate"}
    size="sm"
    {...props}
  />
));

Menu.Label = MenuLabel;
Menu.Item = MenuItem;

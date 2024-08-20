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
        portal={true}
        className={cn(
          "shadow bg-stone-950 z-50",
          "rounded shadow-sm text-sm",
          "translate-y-2 data-[enter]:translate-y-0",
          "opacity-0 data-[enter]:opacity-100 transition",
          "flex flex-col min-w-[180px] py-2 z-50",
          props.className,
        )}
      >
        <Ariakit.PopoverArrow />
        {props.children}
      </Ariakit.Popover>
    </Ariakit.PopoverProvider>
  );
};

const MenuTitle = fr((props, ref) => (
  <div ref={ref} {...props} className={cn("px-4 py-2 text-stone-400 font-semibold text-xs", props.className)} />
));

const MenuButton = fr<{ selected?: boolean }, typeof Button>(({ selected, ...props }, ref) => (
  <Button
    ref={ref}
    radius="none"
    variant={selected ? "filled" : "ghost"}
    color={selected ? "lime" : "stone"}
    size="sm"
    padding="none"
    {...props}
    className={cn(
      "px-3 py-1.5 cursor-default text-context-200 aria-[disabled=false]:hover:bg-context-800",
      "aria-[disabled=false]:active:bg-context-700",
      "[&>svg]:text-context-400 [&>svg]:hover:text-lime-400 gap-3",
      props.className,
    )}
  />
));

const MenuLabel = fr<{}, "label">((props, ref) => (
  <label
    ref={ref}
    {...props}
    className={cn("flex items-center gap-2 px-3 py-1.5 hover:bg-stone-800 text-stone-200", props.className)}
  />
));

const MenuDivider = fr((props, ref) => (
  <div ref={ref} {...props} className={cn("my-1.5 h-px w-full bg-stone-800", props.className)} />
));

Menu.Title = MenuTitle;
Menu.Button = MenuButton;
Menu.Label = MenuLabel;
Menu.Divider = MenuDivider;

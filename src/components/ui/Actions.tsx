import React from "react";

import { RiMore2Fill } from "react-icons/ri";

import { fr } from "~/lib/react";
import { contextColors } from "~/lib/styles";

import { ButtonIcon } from "./ButtonIcon";
import { Menu } from "./Menu";
import { Tooltip } from "./Tooltip";

export type Action = {
  name: string;
  icon: React.ReactNode;
  disabled?: boolean;
  action: (...args: any[]) => any;
  color?: keyof typeof contextColors;
};

export type ActionItem = Action | "divider" | false;

const isDivider = (item: ActionItem): item is "divider" => item === "divider";
const isAction = (item: ActionItem): item is Action => typeof item === "object" && "name" in item;

export const FlexActions = (props: { actions: ActionItem[] }) => {
  return (
    <div className="flex items-center gap-1.5">
      {props.actions
        .filter(Boolean)
        .filter(isAction)
        .filter((act) => !act.disabled)
        .map((act) => {
          return (
            <Tooltip content={act.name} key={act.name}>
              <ButtonIcon variant="light" radius="sm" onClick={() => act.action()} color={act.color ?? "slate"}>
                {act.icon}
              </ButtonIcon>
            </Tooltip>
          );
        })}
    </div>
  );
};

export const MenuActions = fr<{ actions: ActionItem[] }, typeof ButtonIcon>((props, ref) => {
  return (
    <Menu
      target={
        <ButtonIcon ref={ref} variant="ghost" color="stone" {...props}>
          <RiMore2Fill />
        </ButtonIcon>
      }
    >
      <Menu.Title>Actions</Menu.Title>
      {props.actions.filter(Boolean).map((act, index) => {
        if (isDivider(act)) return <Menu.Divider key={index} />;
        if (act.disabled) return null;

        return (
          <Menu.Button key={act.name} onClick={() => act.action()}>
            {act.icon} {act.name}
          </Menu.Button>
        );
      })}
    </Menu>
  );
});

export const ResponsiveActions = (props: { actions: ActionItem[] }) => {
  return (
    <>
      <div className="hidden sm:flex">
        <FlexActions actions={props.actions} />
      </div>
      <div className="flex sm:hidden">
        <MenuActions actions={props.actions} />
      </div>
    </>
  );
};

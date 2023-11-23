import React from "react";

import { Menu, Tooltip } from "@mantine/core";
import { RiMore2Fill } from "react-icons/ri";

import { contextColors } from "~/lib/styles";

import { ButtonIcon } from "./ButtonIcon";

export type Action = {
  name: string;
  icon: React.ReactNode;
  disabled?: boolean;
  action: (...args: any[]) => any;
  color?: keyof typeof contextColors;
};

export const FlexActions = (props: { actions: Action[] }) => {
  return (
    <div className="flex items-center gap-1.5">
      {props.actions
        .filter((act) => !act.disabled)
        .map((act) => {
          return (
            <Tooltip label={act.name} key={act.name}>
              <ButtonIcon variant="light" radius="sm" onClick={() => act.action()} color={act.color ?? "slate"}>
                {act.icon}
              </ButtonIcon>
            </Tooltip>
          );
        })}
    </div>
  );
};

export const MenuActions = (props: { actions: Action[] }) => {
  return (
    <Menu withinPortal withArrow width={200} position="bottom-end">
      <Menu.Target>
        <ButtonIcon radius="full" variant="light" color="slate">
          <RiMore2Fill />
        </ButtonIcon>
      </Menu.Target>
      <Menu.Dropdown>
        {props.actions
          .filter((act) => !act.disabled)
          .map((act) => {
            return (
              <Menu.Item
                key={act.name}
                onClick={() => act.action()}
                leftSection={act.icon}
                className="hover:bg-gray-100 active:bg-gray-200"
              >
                {act.name}
              </Menu.Item>
            );
          })}
      </Menu.Dropdown>
    </Menu>
  );
};

export const ResponsiveActions = (props: { actions: Action[] }) => {
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

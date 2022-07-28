import { Menu, UnstyledButton } from "@mantine/core";
import React from "react";
import { RiCheckLine } from "react-icons/ri";
import { useLang } from "~/hooks";
import { Chevron } from "./Chevron";
import { Flag } from "./Flag";

export const LangSelector = () => {
  const { lang, setLang, langs } = useLang();
  const [opened, setOpened] = React.useState(false);

  return (
    <Menu opened={opened} onChange={setOpened} shadow="md" width={200} position="bottom-end" withArrow>
      <Menu.Target>
        <UnstyledButton
          sx={(t) => ({
            display: "flex",
            alignItems: "center",
            gap: 2,
            color: t.colors.dark[9],
            padding: "2px",
            borderRadius: 3,
            "&:hover": { background: t.colors.gray[2] },
            "&:active": { transform: "translateY(1px)" },
          })}
        >
          <Chevron opened={opened} />
          <Flag src={langs[lang].flag} width={18} />
        </UnstyledButton>
      </Menu.Target>

      <Menu.Dropdown>
        {Object.values(langs).map((l) => {
          return (
            <Menu.Item
              key={l.code}
              icon={<Flag src={l.flag} width={20} />}
              onClick={() => setLang(l.code)}
              rightSection={l.code === lang ? <RiCheckLine size={16} /> : null}
            >
              {l.name}
            </Menu.Item>
          );
        })}
      </Menu.Dropdown>
    </Menu>
  );
};

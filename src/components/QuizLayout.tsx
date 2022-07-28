import React from "react";
import NextLink from "next/link";
import {
  AppShell,
  Group,
  Navbar,
  Text,
  UnstyledButton,
  Stack,
  Box,
  ScrollArea,
  Header,
  ActionIcon,
  Burger,
  MediaQuery,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { GiFlyingFlag, GiEarthAmerica, GiEarthAsiaOceania, GiEarthAfricaEurope } from "react-icons/gi";
import cn from "classnames";
import { useRouter } from "next/router";
import { useIsMounted } from "~/hooks";

export const QuizLayout = ({ children, hideNavbar = true }: { children?: React.ReactNode; hideNavbar?: boolean }) => {
  const [opened, setOpened] = React.useState(false);
  const large = useMediaQuery("(min-width: 1023px)");
  const isMounted = useIsMounted();

  return (
    <AppShell
      padding="md"
      fixed={opened}
      header={
        !large && isMounted ? (
          <Header height={50}>
            <Box sx={{ display: "flex", height: "100%", alignItems: "center" }}>
              <Box p={10}>
                <ActionIcon onClick={() => setOpened((op) => !op)}>
                  <Burger opened={opened} />
                </ActionIcon>
              </Box>
              <GiFlyingFlag size={26} style={{ margin: "auto" }} />
            </Box>
          </Header>
        ) : undefined
      }
      navbar={
        <Navbar
          p="xs"
          {...(hideNavbar
            ? { hiddenBreakpoint: "sm", hidden: !opened, width: { base: 0, sm: 220 } }
            : { width: { base: 200 } })}
        >
          <Navbar.Section grow component={ScrollArea}>
            <Stack spacing="xs">
              <NavbarLink href="/flags/world" icon={<GiEarthAmerica />}>
                World
              </NavbarLink>
              <NavbarLink href="/flags/africa" icon={<GiEarthAfricaEurope />}>
                Africa
              </NavbarLink>
              <NavbarLink href="/flags/america" icon={<GiEarthAmerica />}>
                America
              </NavbarLink>
              <NavbarLink href="/flags/asia" icon={<GiEarthAsiaOceania />}>
                Asia
              </NavbarLink>
              <NavbarLink href="/flags/europe" icon={<GiEarthAfricaEurope />}>
                Europe
              </NavbarLink>
              <NavbarLink href="/flags/oceania" icon={<GiEarthAsiaOceania />}>
                Oceania
              </NavbarLink>
            </Stack>
          </Navbar.Section>
        </Navbar>
      }
      styles={(t) => ({
        main: { backgroundColor: "#f9f9f9" },
      })}
    >
      {children}
    </AppShell>
  );
};

const NavbarLink = (props: { href: string; children: React.ReactNode; icon?: React.ReactNode }) => {
  const router = useRouter();
  const selected = router.asPath === props.href;

  return (
    <NextLink href={props.href} passHref>
      <UnstyledButton
        component="a"
        className={cn({ selected })}
        sx={(theme) => ({
          display: "block",
          width: "100%",
          padding: theme.spacing.xs,
          borderRadius: theme.radius.sm,
          color: theme.colors.dark[9],

          "&:hover, &.selected": {
            backgroundColor: theme.colors.blue[0],
            color: theme.colors.blue[6],
          },
        })}
      >
        <Group align="center">
          <Text color="blue">
            <Group align="center">{props.icon}</Group>
          </Text>
          <Text size="sm">{props.children}</Text>
        </Group>
      </UnstyledButton>
    </NextLink>
  );
};

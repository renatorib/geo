import React from "react";
import NextLink from "next/link";
import {
  AppShell,
  Group,
  Header,
  Navbar,
  Text,
  UnstyledButton,
  Divider,
  Stack,
  Box,
  ThemeIcon,
  ScrollArea,
} from "@mantine/core";
import { GiFlyingFlag, GiEarthAmerica, GiEarthAsiaOceania, GiEarthAfricaEurope } from "react-icons/gi";
import cn from "classnames";
import { useRouter } from "next/router";

export const QuizLayout = ({ children }: { children?: React.ReactNode }) => {
  return (
    <AppShell
      padding="md"
      navbar={
        <Navbar width={{ base: 0, sm: 220 }} p="xs" hiddenBreakpoint="sm" hidden={true}>
          <Navbar.Section>
            <Box p={10}>
              <Group align="center">
                <GiFlyingFlag size={26} />
                <Text weight={700}>Guess the Flag</Text>
              </Group>
            </Box>
          </Navbar.Section>
          <Box py={10} />
          <Navbar.Section grow component={ScrollArea}>
            <Stack spacing="xs">
              <NavbarLink href="/quiz/all" icon={<GiEarthAmerica />}>
                Todos os países
              </NavbarLink>
              <NavbarLink href="/quiz/africa" icon={<GiEarthAfricaEurope />}>
                África
              </NavbarLink>
              <NavbarLink href="/quiz/america" icon={<GiEarthAmerica />}>
                América
              </NavbarLink>
              <NavbarLink href="/quiz/asia" icon={<GiEarthAsiaOceania />}>
                Ásia
              </NavbarLink>
              <NavbarLink href="/quiz/europe" icon={<GiEarthAfricaEurope />}>
                Europa
              </NavbarLink>
              <NavbarLink href="/quiz/oceania" icon={<GiEarthAsiaOceania />}>
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

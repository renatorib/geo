import React from "react";
import NextLink from "next/link";
import { AppShell, Group, Header, Navbar, Text, UnstyledButton, Divider, Stack, Box } from "@mantine/core";
import { GiEarthAmerica, GiEarthAsiaOceania, GiEarthAfricaEurope } from "react-icons/gi";
import cn from "classnames";
import { useRouter } from "next/router";

export const QuizLayout = ({ children }: { children?: React.ReactNode }) => {
  return (
    <AppShell
      padding="md"
      fixed={false}
      navbar={
        <Navbar width={{ base: 300 }} p="xs">
          <Navbar.Section grow mt="xs">
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
      header={
        <Header height={60}>
          <Group sx={{ height: "100%" }} px={20} position="apart">
            <Text weight={700}>Guess the Flag</Text>
          </Group>
        </Header>
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

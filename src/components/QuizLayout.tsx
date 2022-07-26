import React from "react";
import NextLink from "next/link";
import { AppShell, Group, Header, Navbar, Text, UnstyledButton, Divider, Stack, Box } from "@mantine/core";
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
              <NavbarLink href="/quiz/all">Todos os países</NavbarLink>
              <NavbarLink href="/quiz/africa">África</NavbarLink>
              <NavbarLink href="/quiz/america">América</NavbarLink>
              <NavbarLink href="/quiz/asia">Ásia</NavbarLink>
              <NavbarLink href="/quiz/europe">Europa</NavbarLink>
              <NavbarLink href="/quiz/oceania">Oceania</NavbarLink>
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

const NavbarLink = (props: { href: string; children: React.ReactNode }) => {
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
        <Text size="sm">{props.children}</Text>
      </UnstyledButton>
    </NextLink>
  );
};

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
  Header,
  ActionIcon,
  Burger,
  Divider,
  ThemeIcon,
  Collapse,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import {
  GiFlyingFlag,
  GiEarthAmerica,
  GiEarthAsiaOceania,
  GiEarthAfricaEurope,
  GiBrazil,
  GiWorld,
} from "react-icons/gi";
import cn from "classnames";
import { useRouter } from "next/router";
import { useIsMounted } from "~/hooks";
import { Chevron } from "~/components";

export const QuizLayout = ({ children, hideNavbar = true }: { children?: React.ReactNode; hideNavbar?: boolean }) => {
  const [navbarOpened, setNavbarOpened] = React.useState(false);
  const [flagsOpened, setFlagsOpened] = React.useState(true);
  const [shapesOpened, setShapesOpened] = React.useState(true);
  const [othersOpened, setOthersOpened] = React.useState(true);
  const large = useMediaQuery("(min-width: 1023px)");
  const isMounted = useIsMounted();

  return (
    <AppShell
      padding="md"
      fixed={navbarOpened}
      header={
        !large && isMounted ? (
          <Header height={50}>
            <Box sx={{ display: "flex", height: "100%", alignItems: "center" }}>
              <Box p={10}>
                <ActionIcon onClick={() => setNavbarOpened((op) => !op)}>
                  <Burger opened={navbarOpened} />
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
            ? { hiddenBreakpoint: "sm", hidden: !navbarOpened, width: { base: 0, sm: 220 } }
            : { width: { base: 200 } })}
        >
          <Navbar.Section grow>
            <Stack>
              <Text weight={700} align="center" my={18} color="violet">
                Guess the Flag!
              </Text>

              {/* Flags */}
              <Divider
                label={
                  <UnstyledButton
                    px="xs"
                    onClick={() => setFlagsOpened((o) => !o)}
                    sx={(t) => ({ fontSize: "inherit", "&:hover": { background: t.colors.gray[0] } })}
                  >
                    <Group spacing="xs">
                      <GiFlyingFlag />
                      <Text weight="bold">Flags</Text>
                      <Chevron opened={flagsOpened} />
                    </Group>
                  </UnstyledButton>
                }
              />
              <Collapse in={flagsOpened}>
                <Stack spacing="xs" pl="xs" ml="xs" sx={{ borderLeft: "1px solid #eee" }}>
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
                  <NavbarLink href="/flags/others" icon={<GiEarthAmerica />}>
                    Others
                  </NavbarLink>
                </Stack>
              </Collapse>

              {/* Shapes */}
              <Divider
                label={
                  <UnstyledButton
                    px="xs"
                    onClick={() => setShapesOpened((o) => !o)}
                    sx={(t) => ({ fontSize: "inherit", "&:hover": { background: t.colors.gray[0] } })}
                  >
                    <Group spacing="xs">
                      <GiBrazil />
                      <Text weight="bold">Shapes</Text>
                      <Chevron opened={shapesOpened} />
                    </Group>
                  </UnstyledButton>
                }
              />
              <Collapse in={shapesOpened}>
                <Stack spacing="xs" pl="xs" ml="xs" sx={{ borderLeft: "1px solid #eee" }}>
                  <NavbarLink href="/shapes/world" icon={<GiEarthAmerica />}>
                    World
                  </NavbarLink>
                  <NavbarLink href="/shapes/africa" icon={<GiEarthAfricaEurope />}>
                    Africa
                  </NavbarLink>
                  <NavbarLink href="/shapes/america" icon={<GiEarthAmerica />}>
                    America
                  </NavbarLink>
                  <NavbarLink href="/shapes/asia" icon={<GiEarthAsiaOceania />}>
                    Asia
                  </NavbarLink>
                  <NavbarLink href="/shapes/europe" icon={<GiEarthAfricaEurope />}>
                    Europe
                  </NavbarLink>
                  <NavbarLink href="/shapes/oceania" icon={<GiEarthAsiaOceania />}>
                    Oceania
                  </NavbarLink>
                  <NavbarLink href="/shapes/others" icon={<GiEarthAmerica />}>
                    Others
                  </NavbarLink>
                </Stack>
              </Collapse>

              {/* Others */}
              <Divider
                label={
                  <UnstyledButton
                    px="xs"
                    onClick={() => setOthersOpened((o) => !o)}
                    sx={(t) => ({ fontSize: "inherit", "&:hover": { background: t.colors.gray[0] } })}
                  >
                    <Group spacing="xs">
                      <GiWorld />
                      <Text weight="bold">Others</Text>
                      <Chevron opened={othersOpened} />
                    </Group>
                  </UnstyledButton>
                }
              />
              <Collapse in={othersOpened}>
                <Stack spacing="xs" pl="xs" ml="xs" sx={{ borderLeft: "1px solid #eee" }}>
                  <NavbarLink href="/others/world-map" icon={<GiEarthAmerica />}>
                    World Map (Beta)
                  </NavbarLink>
                </Stack>
              </Collapse>
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

          "&:hover": {
            backgroundColor: theme.colors.blue[0],
            color: theme.colors.blue[6],
          },
          "&.selected": {
            backgroundColor: theme.colors.violet[0],
            color: theme.colors.violet[6],
          },
        })}
      >
        <Group align="center">
          <Text color="violet">
            <Group align="center">
              <ThemeIcon variant="light" color={selected ? "violet" : "blue"}>
                {props.icon}
              </ThemeIcon>
            </Group>
          </Text>
          <Text size="sm" color="#333">
            {props.children}
          </Text>
        </Group>
      </UnstyledButton>
    </NextLink>
  );
};

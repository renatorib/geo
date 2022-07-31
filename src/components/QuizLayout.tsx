import React from "react";
import NextLink from "next/link";
import {
  Group,
  Text,
  UnstyledButton,
  Stack,
  Box,
  Header,
  ActionIcon,
  Burger,
  Divider,
  ThemeIcon,
  Drawer,
  Container,
  Menu,
  Switch,
  useMantineTheme,
} from "@mantine/core";
import {
  GiFlyingFlag,
  GiEarthAmerica,
  GiEarthAsiaOceania,
  GiEarthAfricaEurope,
  GiBrazil,
  GiWorld,
} from "react-icons/gi";
import { RiMore2Fill, RiSettings2Line } from "react-icons/ri";
import cn from "classnames";
import { useRouter } from "next/router";
import { Chevron, LangSelector, TranscriptDialog } from "~/components";
import { useSpeechRecognition } from "react-speech-recognition";
import { useLocalStorage } from "@mantine/hooks";

const Logo = () => {
  return (
    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, margin: "auto" }}>
      <GiFlyingFlag size={18} />
      <Text weight={700} align="center">
        Guess the Flag!
      </Text>
    </Box>
  );
};

const AppNavbar = () => {
  const [flagsOpened, setFlagsOpened] = React.useState(true);
  const [shapesOpened, setShapesOpened] = React.useState(false);
  const [othersOpened, setOthersOpened] = React.useState(false);

  return (
    <Stack>
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
      <Box sx={{ display: flagsOpened ? "block" : "none" }}>
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
      </Box>

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
      <Box sx={{ display: shapesOpened ? "block" : "none" }}>
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
      </Box>

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
      <Box sx={{ display: othersOpened ? "block" : "none" }}>
        <Stack spacing="xs" pl="xs" ml="xs" sx={{ borderLeft: "1px solid #eee" }}>
          <NavbarLink href="/others/world-map" icon={<GiEarthAmerica />}>
            World Map (Beta)
          </NavbarLink>
        </Stack>
      </Box>
    </Stack>
  );
};

const AppHeader = () => {
  const theme = useMantineTheme();
  const [navbarOpened, setNavbarOpened] = React.useState(false);
  const { browserSupportsSpeechRecognition } = useSpeechRecognition();
  const [speech, setSpeech] = useLocalStorage({ key: "gtf:speech", defaultValue: "false" });

  return (
    <Box>
      <Header height={50}>
        <Box sx={{ display: "flex", height: "100%", alignItems: "center" }}>
          <Box m={10}>
            <Burger opened={navbarOpened} onClick={() => setNavbarOpened((op) => !op)} size={18} />
          </Box>
          <Logo />
          <Box m={10}>
            <Group ml="auto" spacing="xs">
              <LangSelector />
              <Menu shadow="md" width={200} position="bottom-end" withArrow>
                <Menu.Target>
                  <ActionIcon radius="xl" color="dark">
                    <RiSettings2Line size={20} />
                  </ActionIcon>
                </Menu.Target>

                <Menu.Dropdown>
                  <Menu.Label>Settings</Menu.Label>
                  <Group px={12} py={6} position="apart">
                    <Switch
                      size="sm"
                      checked={speech === "true" ? true : false}
                      onChange={(ev) => setSpeech(String(ev.currentTarget.checked))}
                      disabled={!browserSupportsSpeechRecognition}
                      label={`Enable speech ${!browserSupportsSpeechRecognition ? "(Unsupported)" : ""}`}
                    />
                  </Group>
                </Menu.Dropdown>
              </Menu>
            </Group>
          </Box>
        </Box>
      </Header>

      <Drawer
        title="Menu"
        opened={navbarOpened}
        onClose={() => setNavbarOpened(false)}
        padding="md"
        overlayOpacity={0.55}
        overlayBlur={3}
        overlayColor={theme.colors.gray[2]}
      >
        <Box style={{ height: "calc(100vh - 70px)", overflowY: "auto" }}>
          <AppNavbar />
        </Box>
      </Drawer>
    </Box>
  );
};

export const QuizLayout = ({ children, contained = true }: { children?: React.ReactNode; contained?: boolean }) => {
  const MainWrapper = contained ? Container : Box;

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <AppHeader />
      <MainWrapper>
        <TranscriptDialog />
        <Box component="main" sx={{ minHeight: "calc(100vh - 50px)" }}>
          {children}
        </Box>
      </MainWrapper>
    </Box>
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

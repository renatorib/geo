import NextLink from "next/link";
import { useRouter } from "next/router";
import React from "react";

import {
  Group,
  Text,
  UnstyledButton,
  Stack,
  Box,
  Burger,
  ThemeIcon,
  Drawer,
  Container,
  useMantineTheme,
  Anchor,
  Modal,
  Grid,
  Button,
} from "@mantine/core";
import { RiHome2Line, RiHeart2Fill } from "react-icons/ri";
import { useSnapshot } from "valtio";

import { Logo, RouterTransition } from "~/components";
import { SettingsMenu, LangSelectorMenu } from "~/features/settings";
import { TranscriptDialog } from "~/features/speech-recognition";
import { games } from "~/games";
import { fr } from "~/lib/react";
import { upperFirstLetter } from "~/lib/string";
import { store, storeActions } from "~/stores/store";
import { cn } from "~/styles";

const AppHeader = () => {
  const theme = useMantineTheme();
  const [navbarOpened, setNavbarOpened] = React.useState(false);

  return (
    <Box>
      <header style={{ height: 50 }}>
        <Box style={{ display: "flex", height: "100%", alignItems: "center", justifyContent: "space-between" }}>
          <Box m={10}>
            <Burger opened={navbarOpened} onClick={() => setNavbarOpened((op) => !op)} size={18} />
          </Box>
          <NextLink href="/">
            <Box
              style={{
                position: "absolute",
                left: "50%",
                top: 13,
                transform: "translateX(-50%)",
                color: theme.colors.dark[9],
              }}
            >
              <Logo size={22} color="#449966" />
            </Box>
          </NextLink>
          <Box m={10}>
            <Group ml="auto" gap="xs">
              <LangSelectorMenu />
              <SettingsMenu />
            </Group>
          </Box>
        </Box>
      </header>

      <RouterTransition />

      <Drawer title="Menu" opened={navbarOpened} onClose={() => setNavbarOpened(false)} padding="md" size="xs">
        <Box>
          <Stack>
            <NavbarLink href="/" icon={<RiHome2Line />} color="green">
              Home
            </NavbarLink>

            <div>Games</div>

            {games
              .filter((g) => g.training === false)
              .map((game) => (
                <NavbarLink
                  key={game.id}
                  icon={game.icon}
                  color="violet"
                  onClick={() => {
                    storeActions.setSelectedGame(game);
                    setNavbarOpened(false);
                  }}
                >
                  {game.name}
                </NavbarLink>
              ))}

            <div>Learn</div>

            {games
              .filter((g) => g.training === true)
              .map((game) => (
                <NavbarLink
                  key={game.id}
                  icon={game.icon}
                  onClick={() => {
                    storeActions.setSelectedGame(game);
                    setNavbarOpened(false);
                  }}
                >
                  {game.name}
                </NavbarLink>
              ))}
          </Stack>
        </Box>
      </Drawer>
    </Box>
  );
};

const AppFooter = () => {
  return (
    <Box py="xl">
      <Text
        size="xs"
        c="gray"
        ta="center"
        style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}
      >
        <span>Made with</span>
        <span style={{ verticalAlign: "middle" }}>
          <RiHeart2Fill size={10} color="red" />
        </span>
        <span>by</span>
        <Anchor color="violet" href="https://rena.to" target="_blank" rel="noreferrer">
          rena.to
        </Anchor>
      </Text>
    </Box>
  );
};

const NavbarLink = fr<typeof UnstyledButton<"button">, { href?: string; icon?: React.ReactNode }>(
  ({ href, icon, ...props }, ref) => {
    const router = useRouter();
    const selected = router.asPath === href;

    let button = (
      <UnstyledButton
        {...props}
        ref={ref}
        className={cn(
          "block w-full p-1 rounded text-gray-800 hover:bg-gray-100 hover:text-gray-900",
          selected && "bg-gray-100 text-gray-900",
          props.className,
        )}
      >
        <Group align="center" gap="xs">
          <Text c="violet">
            <Group align="center">
              <ThemeIcon variant={selected ? "filled" : "light"} color={props.color}>
                {icon}
              </ThemeIcon>
            </Group>
          </Text>
          <Text size="sm" c="#333">
            {props.children}
          </Text>
        </Group>
      </UnstyledButton>
    );

    if (href) {
      button = (
        <NextLink href={href} className="no-underline">
          {button}
        </NextLink>
      );
    }

    return button;
  },
);

const GroupsModal = () => {
  const state = useSnapshot(store);

  return (
    <Modal
      opened={!!state.selectedGame}
      onClose={() => storeActions.setSelectedGame(null)}
      title={<div className="font-bold">Play {state.selectedGame?.name}</div>}
      transitionProps={{
        exitDuration: 1,
        duration: 150,
      }}
    >
      <div className="mb-4 text-sm text-gray-700">Choose the group</div>
      <Grid gutter="xs">
        {state.selectedGame &&
          state.selectedGame.groups.map((group) => (
            <Grid.Col key={group.id} span={{ base: 6, x: 4 }}>
              <NextLink
                href={`/play/${state.selectedGame?.id}/${group.id}`}
                onClick={() => storeActions.setSelectedGame(null)}
              >
                <Button color="violet" variant="light" fullWidth>
                  {upperFirstLetter(group.id)}
                </Button>
              </NextLink>
            </Grid.Col>
          ))}
      </Grid>
    </Modal>
  );
};

export const AppLayout = ({
  children,
  contained = true,
  showFooter = true,
  showTranscripter = true,
  showHeader = true,
}: {
  children?: React.ReactNode;
  contained?: boolean;
  showFooter?: boolean;
  showTranscripter?: boolean;
  showHeader?: boolean;
}) => {
  const MainWrapper = contained ? Container : Box;

  return (
    <Box style={{ display: "flex", flexDirection: "column" }}>
      {showHeader && <AppHeader />}
      {showTranscripter && <TranscriptDialog />}
      <GroupsModal />

      <MainWrapper style={{ minHeight: "calc(100vh - 53px)", width: "100%", display: "flex", flexDirection: "column" }}>
        <Box component="main" style={{ height: "100%", flexGrow: 1, display: "flex", alignItems: "stretch" }}>
          {children}
        </Box>
        {showFooter && <AppFooter />}
      </MainWrapper>
    </Box>
  );
};

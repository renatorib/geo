import NextLink from "next/link";
import { useRouter } from "next/router";
import React from "react";

import { Group, Stack, Box, Burger, Drawer, Container, useMantineTheme, Modal, Grid, Button } from "@mantine/core";
import { RiHome2Line, RiHeart2Fill } from "react-icons/ri";
import useVH from "react-vh";
import { useSnapshot } from "valtio";

import { Logo, RouterTransition } from "~/components";
import { SettingsMenu, LangSelectorMenu } from "~/features/settings";
import { TranscriptDialog } from "~/features/speech-recognition";
import { games } from "~/games";
import { fr } from "~/lib/react";
import { upperFirstLetter } from "~/lib/string";
import { cn, contextColors } from "~/lib/styles";
import { store, storeActions } from "~/stores/store";

import { ThemedIcon } from "./ui/ThemedIcon";

const AppHeader = () => {
  useVH();
  const theme = useMantineTheme();
  const [navbarOpened, setNavbarOpened] = React.useState(false);

  return (
    <div>
      <header style={{ height: 50 }}>
        <div className="flex h-full items-center justify-between">
          <div className="m-3">
            <Burger opened={navbarOpened} onClick={() => setNavbarOpened((op) => !op)} size={18} />
          </div>
          <NextLink href="/">
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: 13,
                transform: "translateX(-50%)",
                color: theme.colors.dark[9],
              }}
            >
              <Logo size={22} color="#449966" />
            </div>
          </NextLink>
          <div className="m-3">
            <div className="flex items-center gap-2 ml-auto">
              <LangSelectorMenu />
              <SettingsMenu />
            </div>
          </div>
        </div>
      </header>

      <RouterTransition />

      <Drawer title="Menu" opened={navbarOpened} onClose={() => setNavbarOpened(false)} padding="md" size="xs">
        <div>
          <div className="flex flex-col gap-2">
            <NavbarLink href="/" icon={<RiHome2Line />} color="green">
              Home
            </NavbarLink>

            <div className="mt-3">Games</div>

            {games
              .filter((g) => g.training === false)
              .map((game) => (
                <NavbarLink
                  key={game.id}
                  icon={game.icon}
                  color="violet"
                  startsWith={`/play/${game.id}/`}
                  onClick={() => {
                    storeActions.setSelectedGame(game);
                    setNavbarOpened(false);
                  }}
                >
                  {game.name}
                </NavbarLink>
              ))}

            <div className="mt-3">Learn</div>

            {games
              .filter((g) => g.training === true)
              .map((game) => (
                <NavbarLink
                  key={game.id}
                  icon={game.icon}
                  color="blue"
                  startsWith={`/play/${game.id}/`}
                  onClick={() => {
                    storeActions.setSelectedGame(game);
                    setNavbarOpened(false);
                  }}
                >
                  {game.name}
                </NavbarLink>
              ))}
          </div>
        </div>
      </Drawer>
    </div>
  );
};

const AppFooter = () => {
  return (
    <div className="py-6">
      <div className="text-sm text-gray-600 text-center flex items-center justify-center gap-1">
        <span>Made with</span>
        <span style={{ verticalAlign: "middle" }}>
          <RiHeart2Fill size={10} color="red" />
        </span>
        <span>by</span>
        <a className="text-violet-700" href="https://rena.to" target="_blank" rel="noreferrer">
          rena.to
        </a>
      </div>
    </div>
  );
};

const NavbarLink = fr<
  { href?: string; startsWith?: string; icon?: React.ReactNode; color?: keyof typeof contextColors },
  "button"
>(({ href, startsWith, icon, color, ...props }, ref) => {
  const router = useRouter();
  const selected = (startsWith && router.asPath.startsWith(startsWith)) || router.asPath === href;

  let button = (
    <button
      {...props}
      ref={ref}
      className={cn(
        contextColors[color ?? "slate"],
        "block cursor-pointer border-none w-full px-2 py-1.5 rounded",
        selected
          ? "bg-context-800 hover:bg-context-900 text-context-100"
          : "text-gray-800 bg-gray-50 hover:bg-gray-200 hover:text-gray-900",
        props.className,
      )}
    >
      <div className={cn("flex items-center gap-1")}>
        <span className="text-violet-500">
          <ThemedIcon variant={selected ? "transparent-light" : "transparent"} color={color}>
            {icon}
          </ThemedIcon>
        </span>
        <span className="text-sm">{props.children}</span>
      </div>
    </button>
  );

  if (href) {
    button = (
      <NextLink href={href} className="no-underline">
        {button}
      </NextLink>
    );
  }

  return button;
});

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
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {state.selectedGame &&
          state.selectedGame.groups.map((group) => (
            <div key={group.id}>
              <NextLink
                href={`/play/${state.selectedGame?.id}/${group.id}`}
                onClick={() => storeActions.setSelectedGame(null)}
              >
                <Button color="violet" variant="light" fullWidth>
                  {upperFirstLetter(group.id)}
                </Button>
              </NextLink>
            </div>
          ))}
      </div>
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

      <MainWrapper
        className="min-100dvh"
        style={{
          "--offset-height": "53px",
          width: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box component="main" style={{ height: "100%", flexGrow: 1, display: "flex", alignItems: "stretch" }}>
          {children}
        </Box>
        {showFooter && <AppFooter />}
      </MainWrapper>
    </Box>
  );
};

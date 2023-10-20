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
} from "@mantine/core";
import { RiHome2Line, RiHeart2Fill } from "react-icons/ri";

import { Logo, RouterTransition } from "~/components";
import { SettingsMenu, LangSelectorMenu } from "~/features/settings";
import { TranscriptDialog } from "~/features/speech-recognition";
import { cn } from "~/styles";

const AppNavbar = () => {
  return (
    <Stack>
      <NavbarLink href="/" icon={<RiHome2Line />}>
        Home
      </NavbarLink>
    </Stack>
  );
};

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
              <Logo size={25} />
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

      <Drawer
        title="Menu"
        opened={navbarOpened}
        onClose={() => setNavbarOpened(false)}
        padding="md"
        overlayProps={{
          opacity: 0.55,
          blur: 3,
          color: theme.colors.gray[2],
        }}
      >
        <Box style={{ height: "calc(100vh - 70px)", overflowY: "auto" }}>
          <AppNavbar />
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

const NavbarLink = (props: { href: string; children: React.ReactNode; icon?: React.ReactNode }) => {
  const router = useRouter();
  const selected = router.asPath === props.href;

  return (
    <NextLink href={props.href}>
      <UnstyledButton
        className={cn(
          "block w-full p-1 rounded text-gray-800 hover:bg-blue-100 hover:text-blue-600",
          selected && "bg-violet-100 text-violet-600",
        )}
      >
        <Group align="center" gap="xs">
          <Text c="violet">
            <Group align="center">
              <ThemeIcon variant="light" color={selected ? "violet" : "blue"}>
                {props.icon}
              </ThemeIcon>
            </Group>
          </Text>
          <Text size="sm" c="#333">
            {props.children}
          </Text>
        </Group>
      </UnstyledButton>
    </NextLink>
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
      <MainWrapper style={{ minHeight: "calc(100vh - 53px)", width: "100%", display: "flex", flexDirection: "column" }}>
        <Box component="main" style={{ height: "100%", flexGrow: 1, display: "flex", alignItems: "stretch" }}>
          {children}
        </Box>
        {showFooter && <AppFooter />}
      </MainWrapper>
    </Box>
  );
};

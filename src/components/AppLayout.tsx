import NextLink from "next/link";
import { useRouter } from "next/router";
import React from "react";

import {
  Group,
  Text,
  UnstyledButton,
  Stack,
  Box,
  Header,
  Burger,
  ThemeIcon,
  Drawer,
  Container,
  useMantineTheme,
  Anchor,
} from "@mantine/core";
import cn from "classnames";
import { RiHome2Line, RiHeart2Fill } from "react-icons/ri";

import { Logo } from "~/components";
import { SettingsMenu, LangSelectorMenu } from "~/features/settings";
import { TranscriptDialog } from "~/features/speech-recognition";

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
      <Header height={50}>
        <Box sx={{ display: "flex", height: "100%", alignItems: "center", justifyContent: "space-between" }}>
          <Box m={10}>
            <Burger opened={navbarOpened} onClick={() => setNavbarOpened((op) => !op)} size={18} />
          </Box>
          <NextLink href="/">
            <Box
              sx={{
                position: "absolute",
                left: "50%",
                top: 3,
                transform: "translateX(-50%)",
                color: theme.colors.dark[9],
                transition: "all 200ms ease-in-out",
                "&:hover": {
                  color: theme.colors.violet[5],
                  transform: "translateX(-50%) scale(1.15) rotate(-2deg)",
                },
              }}
            >
              <div className="text-[1.8rem] h-11 flex flex-col justify-center">
                <div>geo</div>
              </div>
            </Box>
          </NextLink>
          <Box m={10}>
            <Group ml="auto" spacing="xs">
              <LangSelectorMenu />
              <SettingsMenu />
            </Group>
          </Box>
        </Box>
      </Header>

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
        color="gray"
        align="center"
        sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}
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
        <Group align="center" spacing="xs">
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
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      {showHeader && <AppHeader />}
      {showTranscripter && <TranscriptDialog />}
      <MainWrapper sx={{ minHeight: "calc(100vh - 50px)", width: "100%", display: "flex", flexDirection: "column" }}>
        <Box component="main" sx={{ height: "100%", flexGrow: 1, display: "flex", alignItems: "stretch" }}>
          {children}
        </Box>
        {showFooter && <AppFooter />}
      </MainWrapper>
    </Box>
  );
};

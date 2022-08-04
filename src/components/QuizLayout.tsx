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
  ThemeIcon,
  Drawer,
  Container,
  Menu,
  Switch,
  useMantineTheme,
  Center,
  Anchor,
} from "@mantine/core";
import { GiFlyingFlag } from "react-icons/gi";
import { RiSettings2Line, RiHome2Line, RiHeart2Fill } from "react-icons/ri";
import cn from "classnames";
import { useRouter } from "next/router";
import { LangSelector, TranscriptDialog } from "~/components";
import { useSpeechRecognition } from "react-speech-recognition";
import { useUserConfig } from "~/hooks";

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
  const { browserSupportsSpeechRecognition } = useSpeechRecognition();
  const { speech, setSpeech, timer, setTimer } = useUserConfig();

  return (
    <Box>
      <Header height={50}>
        <Box sx={{ display: "flex", height: "100%", alignItems: "center" }}>
          <Box m={10}>
            <Burger opened={navbarOpened} onClick={() => setNavbarOpened((op) => !op)} size={18} />
          </Box>
          <NextLink href="/" passHref>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                margin: "auto",
                color: "black",
                textDecoration: "none",
              }}
              component="a"
            >
              <GiFlyingFlag size={18} />
              <Text weight={700} align="center">
                Guess the Country!
              </Text>
            </Box>
          </NextLink>
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
                      checked={speech}
                      onChange={(ev) => setSpeech(ev.currentTarget.checked)}
                      disabled={!browserSupportsSpeechRecognition}
                      label={`Enable speech ${!browserSupportsSpeechRecognition ? "(Unsupported)" : ""}`}
                    />
                  </Group>
                  <Group px={12} py={6} position="apart">
                    <Switch
                      size="sm"
                      checked={timer}
                      onChange={(ev) => setTimer(ev.currentTarget.checked)}
                      label="Show timer"
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

export const QuizLayout = ({
  children,
  contained = true,
  showFooter = true,
}: {
  children?: React.ReactNode;
  contained?: boolean;
  showFooter?: boolean;
}) => {
  const MainWrapper = contained ? Container : Box;

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <AppHeader />
      <TranscriptDialog />
      <MainWrapper sx={{ minHeight: "calc(100vh - 50px)", width: "100%" }}>
        <Box component="main" sx={{ height: "100%" }}>
          {children}
        </Box>
        {showFooter && <AppFooter />}
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

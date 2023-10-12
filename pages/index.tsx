import { Box, Button, Card, Grid, Modal, Text, ThemeIcon, useMantineTheme } from "@mantine/core";
import { useRouter } from "next/router";
import React from "react";

import { upperFirstLetter } from "~/lib/string";
import { AppLayout } from "~/components";
import { games } from "~/games";

const Index = () => {
  const router = useRouter();
  const theme = useMantineTheme();
  const [opened, setOpened] = React.useState(false);
  const [gameUrl, setGameUrl] = React.useState<string>();

  return (
    <AppLayout>
      <Modal opened={opened} onClose={() => setOpened(false)} title="Choose the group">
        <Grid gutter="xs">
          {games
            .find((g) => g.url === gameUrl)
            ?.groups.map((group) => (
              <Grid.Col key={group.url} span={6} xs={4}>
                <Button
                  color="violet"
                  variant="light"
                  onClick={() => router.push(`/play/${gameUrl}/${group.url}`)}
                  fullWidth
                >
                  {upperFirstLetter(group.url)}
                </Button>
              </Grid.Col>
            ))}
        </Grid>
      </Modal>

      <Box py="md" sx={{ width: "100%" }}>
        <Text mb={10} size="sm" weight={700}>
          Select a quiz to play
        </Text>
        <Grid>
          {games.map((game) => (
            <Grid.Col key={game.name} span={12} md={4}>
              <Card
                withBorder
                shadow="sm"
                component="a"
                sx={{
                  cursor: "pointer",
                  "&:hover": { background: theme.colors.gray[0] },
                  "&:active": { background: theme.colors.gray[1] },
                }}
                onClick={() => {
                  setGameUrl(game.url);
                  setOpened(true);
                }}
              >
                <Box sx={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <Box sx={{ fontSize: "40px", color: theme.colors.violet[4], display: "flex" }}>{game.icon}</Box>
                  <Box>
                    <Text color={theme.colors.gray[7]} weight={700}>
                      {game.name}
                    </Text>
                    <Text color="gray" size={"0.8em" as any}>
                      {game.description}
                    </Text>
                  </Box>
                </Box>
              </Card>
            </Grid.Col>
          ))}
        </Grid>
      </Box>
    </AppLayout>
  );
};

export default Index;

import { useRouter } from "next/router";
import React from "react";

import { Box, Button, Card, Grid, Modal, Text } from "@mantine/core";

import { AppLayout } from "~/components";
import { games } from "~/games";
import { upperFirstLetter } from "~/lib/string";

const Index = () => {
  const router = useRouter();
  const [opened, setOpened] = React.useState(false);
  const [gameUrl, setGameUrl] = React.useState<string>();

  return (
    <AppLayout>
      <Modal opened={opened} onClose={() => setOpened(false)} title="Choose the group">
        <Grid gutter="xs">
          {games
            .find((g) => g.id === gameUrl)
            ?.groups.map((group) => (
              <Grid.Col key={group.id} span={{ base: 6, x: 4 }}>
                <Button
                  color="violet"
                  variant="light"
                  onClick={() => router.push(`/play/${gameUrl}/${group.id}`)}
                  fullWidth
                >
                  {upperFirstLetter(group.id)}
                </Button>
              </Grid.Col>
            ))}
        </Grid>
      </Modal>

      <Box style={{ width: "100%", maxHeight: "1000px", display: "grid", placeItems: "center" }}>
        <Box py="md">
          <Text mb={25} size="lg" fw={700}>
            Select a quiz to play
          </Text>
          <Grid>
            {games.map((game) => (
              <Grid.Col key={game.name} span={{ base: 12, md: 4 }}>
                <Card
                  withBorder
                  shadow="sm"
                  component="a"
                  className="cursor-pointer select-none hover:bg-gray-200 active:bg-gray-300"
                  onClick={() => {
                    setGameUrl(game.id);
                    setOpened(true);
                  }}
                >
                  <Box style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                    <Box style={{ fontSize: "40px", color: "var(--mantine-color-violet-6)", display: "flex" }}>
                      {game.icon}
                    </Box>
                    <Box>
                      <Text c="gray.9" fw={700}>
                        {game.name}
                      </Text>
                      <Text c="gray.7" fz="0.8em">
                        {game.description}
                      </Text>
                    </Box>
                  </Box>
                </Card>
              </Grid.Col>
            ))}
          </Grid>
        </Box>
      </Box>
    </AppLayout>
  );
};

export default Index;

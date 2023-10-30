import React from "react";

import { Box, Card, Grid, Stack, Text } from "@mantine/core";

import { AppLayout } from "~/components";
import { Game, games } from "~/games";
import { storeActions } from "~/stores/store";

const Index = () => {
  return (
    <AppLayout>
      <Box style={{ width: "100%", maxHeight: "1000px", display: "grid", placeItems: "center", margin: "2rem 0" }}>
        <Stack gap={36}>
          <Stack gap={12}>
            <Text size="lg" fw={700}>
              Select a quiz to play
            </Text>
            <Grid>
              {games
                .filter((g) => g.training === false)
                .map((game) => (
                  <Grid.Col key={game.name} span={{ base: 12, md: 4 }}>
                    <GameCard game={game} color="violet" />
                  </Grid.Col>
                ))}
            </Grid>
          </Stack>

          <Stack gap={12}>
            <Text size="lg" fw={700}>
              To play and learn
            </Text>
            <Grid>
              {games
                .filter((g) => g.training === true)
                .map((game) => (
                  <Grid.Col key={game.name} span={{ base: 12, md: 4 }}>
                    <GameCard game={game} color="blue" />
                  </Grid.Col>
                ))}
            </Grid>
          </Stack>
        </Stack>
      </Box>
    </AppLayout>
  );
};

const GameCard = ({ game, color }: { game: Game<any>; color?: string }) => {
  return (
    <Card
      withBorder
      shadow="sm"
      component="a"
      className="cursor-pointer select-none hover:bg-gray-200 active:bg-gray-300"
      onClick={() => storeActions.setSelectedGame(game)}
    >
      <Box style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        <Box style={{ fontSize: "40px", color: `var(--mantine-color-${color}-6)`, display: "flex" }}>{game.icon}</Box>
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
  );
};

export default Index;

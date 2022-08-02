import { Box, Button, Card, Grid, Group, Modal, Text } from "@mantine/core";
import { useRouter } from "next/router";
import React from "react";

import { upperFirstLetter } from "~/modules/string";
import { QuizLayout } from "~/components/QuizLayout";
import { games } from "~/games";

const Index = () => {
  const router = useRouter();
  const [opened, setOpened] = React.useState(false);
  const [game, setGame] = React.useState<string>();

  return (
    <QuizLayout>
      <Modal opened={opened} onClose={() => setOpened(false)} title="Choose the mode">
        <Group spacing="xs">
          {games
            .find((g) => g.name === game)
            ?.groups.map((group) => (
              <Button variant="outline" key={group.name} onClick={() => router.push(`/play/${game}/${group.name}`)}>
                {upperFirstLetter(group.name)}
              </Button>
            ))}
        </Group>
      </Modal>

      <Box py="md" sx={{ width: "100%" }}>
        <Text mb={10} weight={700}>
          Select a quiz type
        </Text>
        <Grid>
          {games.map((game) => (
            <Grid.Col key={game.name} span={12} md={4}>
              <Card
                withBorder
                shadow="sm"
                component="a"
                sx={{ cursor: "pointer", "&:hover": { background: "#f6f6f6" } }}
                onClick={() => {
                  setGame(game.name);
                  setOpened(true);
                }}
              >
                {upperFirstLetter(game.name)}
              </Card>
            </Grid.Col>
          ))}
        </Grid>
      </Box>
    </QuizLayout>
  );
};

export default Index;

import { Box, Button, Card, Grid, Group, Modal, Select, Stack, Text, ThemeIcon, useMantineTheme } from "@mantine/core";
import { useRouter } from "next/router";
import React from "react";

import { upperFirstLetter } from "~/modules/string";
import { QuizLayout } from "~/components/QuizLayout";
import { games } from "~/games";
import { RiPlayFill } from "react-icons/ri";

type Game = typeof games[number];

const Index = () => {
  const theme = useMantineTheme();
  const [opened, setOpened] = React.useState(false);
  const [game, setGame] = React.useState<Game>();

  return (
    <QuizLayout>
      <Modal opened={opened && game != null} onClose={() => setOpened(false)} withCloseButton={false}>
        {game && <GameForm game={game} />}
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
                  "&:hover": { background: theme.colors.violet[0] },
                  "&:active": { background: theme.colors.violet[1] },
                }}
                onClick={() => {
                  setOpened(true);
                  setGame(game);
                }}
              >
                <Box sx={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <Box>
                    <ThemeIcon color="violet" variant="light">
                      {game.icon}
                    </ThemeIcon>
                  </Box>
                  <Box>
                    <Text color="violet" weight={700}>
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
    </QuizLayout>
  );
};

const GameForm = ({ game }: { game: Game }) => {
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const group = form.group as HTMLInputElement;
    setLoading(true);
    router.push(`/play/${game.url}/${group.value}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack>
        <Text weight={700}>Play {game.name}</Text>

        <div>{game.description}</div>

        <Group align="flex-end" grow>
          <Select
            label="Select a group to play"
            name="group"
            data={game.groups.map((g) => ({ value: g.url, label: upperFirstLetter(g.url) })) ?? []}
            defaultValue={game.groups[0].url}
          />

          <Button type="submit" ml="auto" rightIcon={<RiPlayFill />} loading={loading} loaderPosition="right">
            Play
          </Button>
        </Group>
      </Stack>
    </form>
  );
};

export default Index;

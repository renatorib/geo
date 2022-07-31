import { Anchor, Box, Card, Grid } from "@mantine/core";
import NextLink from "next/link";
import React from "react";

import { QuizLayout } from "~/components/QuizLayout";

const Index = () => {
  return (
    <QuizLayout>
      <Box py="md" sx={{ width: "100%" }}>
        <Grid>
          <Grid.Col span={12} md={4}>
            <NextLink href="/flags/world" passHref>
              <Card withBorder shadow="sm" component="a" sx={{ "&:hover": { background: "#f6f6f6" } }}>
                Flags of World
              </Card>
            </NextLink>
          </Grid.Col>
          <Grid.Col span={12} md={4}>
            <NextLink href="/flags/world" passHref>
              <Card withBorder shadow="sm" component="a" sx={{ "&:hover": { background: "#f6f6f6" } }}>
                Shapes of World
              </Card>
            </NextLink>
          </Grid.Col>
          <Grid.Col span={12} md={4}>
            <NextLink href="/others/world-map" passHref>
              <Card withBorder shadow="sm" component="a" sx={{ "&:hover": { background: "#f6f6f6" } }}>
                World Map
              </Card>
            </NextLink>
          </Grid.Col>
        </Grid>
      </Box>
    </QuizLayout>
  );
};

export default Index;

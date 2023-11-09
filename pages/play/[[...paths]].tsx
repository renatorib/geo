import React from "react";

import { GetStaticPaths, GetStaticProps } from "next";

import { AppLayout, NoSSR } from "~/components";
import { CardsGrid, Cards1x1, WorldMap, WorldMap1x1 } from "~/components/game-types";
import { games, findGameByUrl } from "~/games";

type PageProps = { url: string };

export const getStaticProps: GetStaticProps<PageProps, { paths: string[] }> = ({ params }) => {
  const url = (params?.paths ?? []).join("/");

  return {
    revalidate: 60,
    props: { url },
  };
};

export const getStaticPaths: GetStaticPaths = () => {
  const paths = games.flatMap((game) => game.groups.flatMap((group) => `${game.id}/${group.id}`));

  return {
    paths: paths.map((path) => ({ params: { paths: path.split("/") } })),
    fallback: false,
  };
};

const Play = ({ url }: PageProps) => {
  // <game_url>/<game_group>
  // ex.: flags/world
  const game = findGameByUrl(url);

  if (!game) {
    return null;
  }

  if (game.type === "world-map") {
    return (
      <AppLayout contained={false} showFooter={false} key={url}>
        <NoSSR>
          {() => <WorldMap title={game.title} data={game.filteredData} dataToRender={game.data} answer={game.answer} />}
        </NoSSR>
      </AppLayout>
    );
  }

  if (game.type === "world-map-1x1") {
    return (
      <AppLayout contained={false} showFooter={false} key={url}>
        <NoSSR>
          {() => (
            <WorldMap1x1 title={game.title} data={game.filteredData} dataToRender={game.data} answer={game.answer} />
          )}
        </NoSSR>
      </AppLayout>
    );
  }

  if (game.type === "cards-grid") {
    return (
      <AppLayout key={url}>
        <NoSSR>{() => <CardsGrid game={game} />}</NoSSR>
      </AppLayout>
    );
  }

  if (game.type === "cards-1x1") {
    return (
      <AppLayout key={url}>
        <NoSSR>{() => <Cards1x1 game={game} />}</NoSSR>
      </AppLayout>
    );
  }
};

export default Play;

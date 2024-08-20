import React from "react";

import { GetStaticPaths, GetStaticProps } from "next";

import { NoSSR } from "~/components";
import { AppLayout2 } from "~/components/AppLayout2";
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
  const game = findGameByUrl(url);
  if (!game) return null;

  if (game.type === "world-map") {
    return (
      <AppLayout2 key={url}>
        <NoSSR>{() => <WorldMap1x1 oneByOne={false} game={game} />}</NoSSR>
      </AppLayout2>
    );
  }

  if (game.type === "world-map-1x1") {
    return (
      <AppLayout2 key={url}>
        <NoSSR>{() => <WorldMap1x1 oneByOne={true} game={game} />}</NoSSR>
      </AppLayout2>
    );
  }

  if (game.type === "cards-grid") {
    return (
      <AppLayout2 key={url}>
        <NoSSR>{() => <CardsGrid game={game} />}</NoSSR>
      </AppLayout2>
    );
  }

  if (game.type === "cards-1x1") {
    return (
      <AppLayout2 key={url}>
        <NoSSR>{() => <Cards1x1 game={game} />}</NoSSR>
      </AppLayout2>
    );
  }
};

export default Play;

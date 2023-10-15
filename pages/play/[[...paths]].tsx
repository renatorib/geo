import React from "react";

import { GetStaticPaths, GetStaticProps } from "next";

import { AppLayout, NoSSR } from "~/components";
import { Cards, Cards1x1, WorldMap } from "~/components/game-types";
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
  const paths = games.flatMap((game) => game.groups.flatMap((group) => `${game.url}/${group.url}`));

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
      <AppLayout contained={false} showFooter={false}>
        <NoSSR>{() => <WorldMap countries={game.data} answer={game.answer} />}</NoSSR>
      </AppLayout>
    );
  }

  if (game.type === "cards") {
    return (
      <AppLayout>
        <NoSSR>{() => <Cards title={game.title} data={game.data} display={game.display} answer={game.answer} />}</NoSSR>
      </AppLayout>
    );
  }

  if (game.type === "cards-1x1") {
    return (
      <AppLayout>
        <NoSSR>
          {() => <Cards1x1 title={game.title} data={game.data} display={game.display} answer={game.answer} />}
        </NoSSR>
      </AppLayout>
    );
  }
};

export default Play;

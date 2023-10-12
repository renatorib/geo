import React from "react";

import { GetStaticPaths, GetStaticProps } from "next";

import { NoSSR, WorldMap, AppLayout, Quiz } from "~/components";
import { QuizZen } from "~/components/QuizZen";
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
        <NoSSR>{() => <Quiz title={game.title} data={game.data} display={game.display} answer={game.answer} />}</NoSSR>
      </AppLayout>
    );
  }

  if (game.type === "zen") {
    return (
      <AppLayout>
        <NoSSR>
          {() => <QuizZen title={game.title} data={game.data} display={game.display} answer={game.answer} />}
        </NoSSR>
      </AppLayout>
    );
  }
};

export default Play;

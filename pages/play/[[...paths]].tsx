import React from "react";
import { GetStaticPaths, GetStaticProps } from "next";

import { QuizLayout } from "~/components/QuizLayout";
import { Quiz } from "~/components/Quiz";
import { NoSSR, WorldMap } from "~/components";
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
  const game = findGameByUrl(url);

  if (!game) {
    return null;
  }

  if (game.type === "world-map") {
    return (
      <QuizLayout contained={false} showFooter={false}>
        <NoSSR>{() => <WorldMap countries={game.data} guess={game.guess} />}</NoSSR>
      </QuizLayout>
    );
  }

  if (game.type === "cards") {
    return (
      <QuizLayout>
        <NoSSR>{() => <Quiz title={game.title} data={game.data} display={game.display} guess={game.guess} />}</NoSSR>
      </QuizLayout>
    );
  }
};

export default Play;

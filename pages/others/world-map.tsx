import React from "react";

import { WorldMap, NoSSR, QuizLayout } from "~/components";
import { countries } from "~/countries";

const Page = () => {
  return (
    <QuizLayout contained={false}>
      <NoSSR>{() => <WorldMap countries={countries.filter((c) => c.shape != null)} />}</NoSSR>
    </QuizLayout>
  );
};

export default Page;

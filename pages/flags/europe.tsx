import React from "react";

import { QuizLayout } from "~/components/QuizLayout";
import { QuizNoSSR } from "~/components/Quiz";
import { countries } from "~/countries";
import { Continent } from "~/countries/enums";

const Europe = () => {
  return (
    <QuizLayout>
      <QuizNoSSR title="Europe Flags" countries={countries.filter(({ continent }) => continent === Continent.Europe)} />
    </QuizLayout>
  );
};

export default Europe;

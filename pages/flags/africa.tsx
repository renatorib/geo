import React from "react";

import { QuizLayout } from "~/components/QuizLayout";
import { QuizNoSSR } from "~/components/Quiz";
import { countries } from "~/countries";
import { Continent } from "~/countries/enums";

const Africa = () => {
  return (
    <QuizLayout>
      <QuizNoSSR title="Africa Flags" countries={countries.filter(({ continent }) => continent === Continent.Africa)} />
    </QuizLayout>
  );
};

export default Africa;

import React from "react";

import { QuizLayout } from "~/components/QuizLayout";
import { QuizNoSSR } from "~/components/Quiz";
import { countries } from "~/countries";
import { Continent } from "~/countries/enums";

const Oceania = () => {
  return (
    <QuizLayout>
      <QuizNoSSR
        title="Oceania Flags"
        countries={countries.filter(({ continent }) => continent === Continent.Oceania)}
      />
    </QuizLayout>
  );
};

export default Oceania;

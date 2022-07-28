import React from "react";

import { QuizLayout } from "~/components/QuizLayout";
import { QuizNoSSR } from "~/components/Quiz";
import { countries } from "~/countries";
import { Continent } from "~/countries/enums";

const Oceania = () => {
  return (
    <QuizLayout>
      <QuizNoSSR
        type="shape"
        title="Oceania Shapes"
        countries={countries.filter((c) => c.continent === Continent.Oceania && c.shape != null)}
      />
    </QuizLayout>
  );
};

export default Oceania;

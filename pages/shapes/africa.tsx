import React from "react";

import { QuizLayout } from "~/components/QuizLayout";
import { QuizNoSSR } from "~/components/Quiz";
import { countries } from "~/countries";
import { Continent } from "~/countries/enums";

const Africa = () => {
  return (
    <QuizLayout>
      <QuizNoSSR
        type="shape"
        title="Africa Shapes"
        countries={countries.filter((c) => c.continent === Continent.Africa && c.shape != null)}
      />
    </QuizLayout>
  );
};

export default Africa;

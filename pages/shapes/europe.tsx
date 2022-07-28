import React from "react";

import { QuizLayout } from "~/components/QuizLayout";
import { QuizNoSSR } from "~/components/Quiz";
import { countries } from "~/countries";
import { Continent } from "~/countries/enums";

const Europe = () => {
  return (
    <QuizLayout>
      <QuizNoSSR
        type="shape"
        title="Europe Shapes"
        countries={countries.filter((c) => c.continent === Continent.Europe && c.shape != null)}
      />
    </QuizLayout>
  );
};

export default Europe;

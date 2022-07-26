import React from "react";

import { QuizLayout } from "~/components/QuizLayout";
import { Quiz } from "~/components/Quiz";
import { countries, Continent } from "~/countries";

const Oceania = () => {
  return (
    <QuizLayout>
      <Quiz title="Oceania" countries={countries.filter(({ continent }) => continent === Continent.Oceania)} />
    </QuizLayout>
  );
};

export default Oceania;

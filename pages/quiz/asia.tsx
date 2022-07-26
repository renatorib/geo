import React from "react";

import { QuizLayout } from "~/components/QuizLayout";
import { Quiz } from "~/components/Quiz";
import { countries, Continent } from "~/countries";

const Asia = () => {
  return (
    <QuizLayout>
      <Quiz title="Ásia" countries={countries.filter(({ continent }) => continent === Continent.Asia)} />
    </QuizLayout>
  );
};

export default Asia;

import React from "react";

import { QuizLayout } from "~/components/QuizLayout";
import { Quiz } from "~/components/Quiz";
import { countries, Continent } from "~/countries";

const Europe = () => {
  return (
    <QuizLayout>
      <Quiz title="Europa" countries={countries.filter(({ continent }) => continent === Continent.Europe)} />
    </QuizLayout>
  );
};

export default Europe;

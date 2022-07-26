import React from "react";

import { QuizLayout } from "~/components/QuizLayout";
import { Quiz } from "~/components/Quiz";
import { countries, Continent } from "~/countries";

const Africa = () => {
  return (
    <QuizLayout>
      <Quiz title="África" countries={countries.filter(({ continent }) => continent === Continent.Africa)} />
    </QuizLayout>
  );
};

export default Africa;

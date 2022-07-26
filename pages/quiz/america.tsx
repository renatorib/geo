import React from "react";

import { QuizLayout } from "~/components/QuizLayout";
import { Quiz } from "~/components/Quiz";
import { countries, Continent } from "~/countries";

const America = () => {
  return (
    <QuizLayout>
      <Quiz title="América" countries={countries.filter(({ continent }) => continent === Continent.America)} />
    </QuizLayout>
  );
};

export default America;

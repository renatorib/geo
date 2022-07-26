import React from "react";

import { QuizLayout } from "~/components/QuizLayout";
import { Quiz } from "~/components/Quiz";
import { countries } from "~/countries";

const All = () => {
  return (
    <QuizLayout>
      <Quiz title="Todos os países" countries={countries} />
    </QuizLayout>
  );
};

export default All;

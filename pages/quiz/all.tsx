import React from "react";

import { QuizLayout } from "~/components/QuizLayout";
import { Quiz } from "~/components/Quiz";
import { all } from "~/countries";

const All = () => {
  return (
    <QuizLayout>
      <Quiz title="Todos os países" countries={all} />
    </QuizLayout>
  );
};

export default All;

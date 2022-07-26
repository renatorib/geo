import React from "react";

import { QuizLayout } from "~/components/QuizLayout";
import { Quiz } from "~/components/Quiz";
import { asia } from "~/countries";

const Asia = () => {
  return (
    <QuizLayout>
      <Quiz title="Ásia" countries={asia} />
    </QuizLayout>
  );
};

export default Asia;

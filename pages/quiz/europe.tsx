import React from "react";

import { QuizLayout } from "~/components/QuizLayout";
import { Quiz } from "~/components/Quiz";
import { europe } from "~/countries";

const Europe = () => {
  return (
    <QuizLayout>
      <Quiz title="Europa" countries={europe} />
    </QuizLayout>
  );
};

export default Europe;

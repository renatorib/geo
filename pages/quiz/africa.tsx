import React from "react";

import { QuizLayout } from "~/components/QuizLayout";
import { Quiz } from "~/components/Quiz";
import { africa } from "~/countries";

const Africa = () => {
  return (
    <QuizLayout>
      <Quiz title="África" countries={africa} />
    </QuizLayout>
  );
};

export default Africa;

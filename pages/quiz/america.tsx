import React from "react";

import { QuizLayout } from "~/components/QuizLayout";
import { Quiz } from "~/components/Quiz";
import { america } from "~/countries";

const America = () => {
  return (
    <QuizLayout>
      <Quiz title="América" countries={america} />
    </QuizLayout>
  );
};

export default America;

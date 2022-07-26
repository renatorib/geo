import React from "react";

import { QuizLayout } from "~/components/QuizLayout";
import { Quiz } from "~/components/Quiz";
import { oceania } from "~/countries";

const Oceania = () => {
  return (
    <QuizLayout>
      <Quiz title="Oceania" countries={oceania} />
    </QuizLayout>
  );
};

export default Oceania;

import React from "react";

import { QuizLayout } from "~/components/QuizLayout";
import { QuizNoSSR } from "~/components/Quiz";
import { countries } from "~/countries";

const World = () => {
  return (
    <QuizLayout>
      <QuizNoSSR type="shape" title="World Shapes" countries={countries} />
    </QuizLayout>
  );
};

export default World;

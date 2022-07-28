import React from "react";

import { QuizLayout } from "~/components/QuizLayout";
import { QuizNoSSR } from "~/components/Quiz";
import { countries } from "~/countries";

const World = () => {
  return (
    <QuizLayout>
      <QuizNoSSR title="World Flags" countries={countries} />
    </QuizLayout>
  );
};

export default World;
import React from "react";

import { QuizLayout } from "~/components/QuizLayout";
import { QuizNoSSR } from "~/components/Quiz";
import { countries } from "~/countries";
import { Continent } from "~/countries/enums";

const Asia = () => {
  return (
    <QuizLayout>
      <QuizNoSSR title="Asia Flags" countries={countries.filter(({ continent }) => continent === Continent.Asia)} />
    </QuizLayout>
  );
};

export default Asia;

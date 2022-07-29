import React from "react";

import { QuizLayout } from "~/components/QuizLayout";
import { QuizNoSSR } from "~/components/Quiz";
import { countries } from "~/countries";
import { Region } from "~/countries/enums";

const Asia = () => {
  return (
    <QuizLayout>
      <QuizNoSSR
        type="shape"
        title="Asia Shapes"
        countries={countries.filter((c) => c.region === Region.Asia && c.shape != null)}
      />
    </QuizLayout>
  );
};

export default Asia;

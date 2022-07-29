import React from "react";

import { QuizLayout } from "~/components/QuizLayout";
import { QuizNoSSR } from "~/components/Quiz";
import { countries } from "~/countries";
import { Region } from "~/countries/enums";

const Other = () => {
  return (
    <QuizLayout>
      <QuizNoSSR
        type="shape"
        title="Other Shapes"
        countries={countries.filter((c) => c.region == null && c.shape != null)}
      />
    </QuizLayout>
  );
};

export default Other;

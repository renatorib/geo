import React from "react";

import { QuizLayout } from "~/components/QuizLayout";
import { QuizNoSSR } from "~/components/Quiz";
import { countries } from "~/countries";

const Other = () => {
  return (
    <QuizLayout>
      <QuizNoSSR title="Other Flags" countries={countries.filter((c) => c.region == null)} />
    </QuizLayout>
  );
};

export default Other;

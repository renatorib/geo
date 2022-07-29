import React from "react";

import { QuizLayout } from "~/components/QuizLayout";
import { QuizNoSSR } from "~/components/Quiz";
import { countries } from "~/countries";
import { Region } from "~/countries/enums";

const Asia = () => {
  return (
    <QuizLayout>
      <QuizNoSSR title="Asia Flags" countries={countries.filter((c) => c.region === Region.Asia && c.flag != null)} />
    </QuizLayout>
  );
};

export default Asia;

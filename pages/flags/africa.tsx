import React from "react";

import { QuizLayout } from "~/components/QuizLayout";
import { QuizNoSSR } from "~/components/Quiz";
import { countries } from "~/countries";
import { Region } from "~/countries/enums";

const Africa = () => {
  return (
    <QuizLayout>
      <QuizNoSSR
        title="Africa Flags"
        countries={countries.filter((c) => c.region === Region.Africa && c.flag != null)}
      />
    </QuizLayout>
  );
};

export default Africa;

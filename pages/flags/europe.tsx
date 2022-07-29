import React from "react";

import { QuizLayout } from "~/components/QuizLayout";
import { QuizNoSSR } from "~/components/Quiz";
import { countries } from "~/countries";
import { Region } from "~/countries/enums";

const Europe = () => {
  return (
    <QuizLayout>
      <QuizNoSSR
        title="Europe Flags"
        countries={countries.filter((c) => c.region === Region.Europe && c.flag != null)}
      />
    </QuizLayout>
  );
};

export default Europe;

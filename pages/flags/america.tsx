import React from "react";

import { QuizLayout } from "~/components/QuizLayout";
import { QuizNoSSR } from "~/components/Quiz";
import { countries } from "~/countries";
import { Region } from "~/countries/enums";

const America = () => {
  return (
    <QuizLayout>
      <QuizNoSSR
        title="America Flags"
        countries={countries.filter((c) => c.region === Region.America && c.flag != null)}
      />
    </QuizLayout>
  );
};

export default America;

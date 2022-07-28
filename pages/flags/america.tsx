import React from "react";

import { QuizLayout } from "~/components/QuizLayout";
import { QuizNoSSR } from "~/components/Quiz";
import { countries } from "~/countries";
import { Continent } from "~/countries/enums";

const America = () => {
  return (
    <QuizLayout>
      <QuizNoSSR
        title="America Flags"
        countries={countries.filter(({ continent }) => continent === Continent.America)}
      />
    </QuizLayout>
  );
};

export default America;

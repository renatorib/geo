import React from "react";

import { QuizLayout } from "~/components/QuizLayout";
import { QuizNoSSR } from "~/components/Quiz";
import { countries } from "~/countries";
import { Continent } from "~/countries/enums";

const America = () => {
  return (
    <QuizLayout>
      <QuizNoSSR
        type="shape"
        title="America Shapes"
        countries={countries.filter((c) => c.continent === Continent.America && c.shape != null)}
      />
    </QuizLayout>
  );
};

export default America;
import React from "react";

import { QuizLayout } from "~/components/QuizLayout";
import { QuizNoSSR } from "~/components/Quiz";
import { countries } from "~/countries";
import { Region } from "~/countries/enums";

const America = () => {
  return (
    <QuizLayout>
      <QuizNoSSR
        type="shape"
        title="America Shapes"
        countries={countries.filter((c) => c.region === Region.America && c.shape != null)}
      />
    </QuizLayout>
  );
};

export default America;

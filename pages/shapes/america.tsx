import React from "react";
import dynamic from "next/dynamic";

import { QuizLayout } from "~/components/QuizLayout";
import { Quiz } from "~/components/Quiz";
import { countries } from "~/countries";
import { Continent } from "~/countries/enums";

const QuizNoSSR = dynamic(() => Promise.resolve(Quiz), { ssr: false });

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

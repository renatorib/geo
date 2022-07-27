import React from "react";
import dynamic from "next/dynamic";

import { QuizLayout } from "~/components/QuizLayout";
import { Quiz } from "~/components/Quiz";
import { countries } from "~/countries";
import { Continent } from "~/countries/enums";

const QuizNoSSR = dynamic(() => Promise.resolve(Quiz), { ssr: false });

const Africa = () => {
  return (
    <QuizLayout>
      <QuizNoSSR
        type="shape"
        title="Africa Shapes"
        countries={countries.filter((c) => c.continent === Continent.Africa && c.shape != null)}
      />
    </QuizLayout>
  );
};

export default Africa;

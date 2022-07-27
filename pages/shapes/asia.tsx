import React from "react";
import dynamic from "next/dynamic";

import { QuizLayout } from "~/components/QuizLayout";
import { Quiz } from "~/components/Quiz";
import { countries } from "~/countries";
import { Continent } from "~/countries/enums";

const QuizNoSSR = dynamic(() => Promise.resolve(Quiz), { ssr: false });

const Asia = () => {
  return (
    <QuizLayout>
      <QuizNoSSR
        type="shape"
        title="Asia Shapes"
        countries={countries.filter((c) => c.continent === Continent.Asia && c.shape != null)}
      />
    </QuizLayout>
  );
};

export default Asia;

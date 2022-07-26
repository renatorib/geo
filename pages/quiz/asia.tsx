import React from "react";
import dynamic from "next/dynamic";

import { QuizLayout } from "~/components/QuizLayout";
import { Quiz } from "~/components/Quiz";
import { countries, Continent } from "~/countries";

const QuizNoSSR = dynamic(() => Promise.resolve(Quiz), { ssr: false });

const Asia = () => {
  return (
    <QuizLayout>
      <QuizNoSSR title="Ásia" countries={countries.filter(({ continent }) => continent === Continent.Asia)} />
    </QuizLayout>
  );
};

export default Asia;

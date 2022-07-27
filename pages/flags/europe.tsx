import React from "react";
import dynamic from "next/dynamic";

import { QuizLayout } from "~/components/QuizLayout";
import { Quiz } from "~/components/Quiz";
import { countries } from "~/countries";
import { Continent } from "~/countries/enums";

const QuizNoSSR = dynamic(() => Promise.resolve(Quiz), { ssr: false });

const Europe = () => {
  return (
    <QuizLayout>
      <QuizNoSSR title="Europe" countries={countries.filter(({ continent }) => continent === Continent.Europe)} />
    </QuizLayout>
  );
};

export default Europe;

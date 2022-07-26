import React from "react";
import dynamic from "next/dynamic";

import { QuizLayout } from "~/components/QuizLayout";
import { Quiz } from "~/components/Quiz";
import { countries, Continent } from "~/countries";

const QuizNoSSR = dynamic(() => Promise.resolve(Quiz), { ssr: false });

const Europe = () => {
  return (
    <QuizLayout>
      <QuizNoSSR title="Europa" countries={countries.filter(({ continent }) => continent === Continent.Europe)} />
    </QuizLayout>
  );
};

export default Europe;
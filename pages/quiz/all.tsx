import React from "react";
import dynamic from "next/dynamic";

import { QuizLayout } from "~/components/QuizLayout";
import { Quiz } from "~/components/Quiz";
import { countries } from "~/countries";

const QuizNoSSR = dynamic(() => Promise.resolve(Quiz), { ssr: false });

const All = () => {
  return (
    <QuizLayout>
      <QuizNoSSR title="Todos os países" countries={countries} />
    </QuizLayout>
  );
};

export default All;

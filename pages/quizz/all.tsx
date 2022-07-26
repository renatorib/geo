import React from "react";

import { QuizzesLayout } from "~/components/QuizzesLayout";
import { Quizz } from "~/components/Quizz";
import { all } from "~/countries";

const All = () => {
  return (
    <QuizzesLayout>
      <Quizz title="Todos os países" countries={all} />
    </QuizzesLayout>
  );
};

export default All;

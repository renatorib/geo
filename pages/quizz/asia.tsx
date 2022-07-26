import React from "react";

import { QuizzesLayout } from "~/components/QuizzesLayout";
import { Quizz } from "~/components/Quizz";
import { asia } from "~/countries";

const Asia = () => {
  return (
    <QuizzesLayout>
      <Quizz title="Ásia" countries={asia} />
    </QuizzesLayout>
  );
};

export default Asia;

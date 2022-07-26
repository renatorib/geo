import React from "react";

import { QuizzesLayout } from "~/components/QuizzesLayout";
import { Quizz } from "~/components/Quizz";
import { europe } from "~/countries";

const Europe = () => {
  return (
    <QuizzesLayout>
      <Quizz title="Europa" countries={europe} />
    </QuizzesLayout>
  );
};

export default Europe;

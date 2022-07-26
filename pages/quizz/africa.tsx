import React from "react";

import { QuizzesLayout } from "~/components/QuizzesLayout";
import { Quizz } from "~/components/Quizz";
import { africa } from "~/countries";

const Africa = () => {
  return (
    <QuizzesLayout>
      <Quizz title="África" countries={africa} />
    </QuizzesLayout>
  );
};

export default Africa;

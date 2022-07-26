import React from "react";

import { QuizzesLayout } from "~/components/QuizzesLayout";
import { Quizz } from "~/components/Quizz";
import { oceania } from "~/countries";

const Oceania = () => {
  return (
    <QuizzesLayout>
      <Quizz title="Oceania" countries={oceania} />
    </QuizzesLayout>
  );
};

export default Oceania;

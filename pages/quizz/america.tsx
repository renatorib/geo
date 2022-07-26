import React from "react";

import { QuizzesLayout } from "~/components/QuizzesLayout";
import { Quizz } from "~/components/Quizz";
import { america } from "~/countries";

const America = () => {
  return (
    <QuizzesLayout>
      <Quizz title="América" countries={america} />
    </QuizzesLayout>
  );
};

export default America;

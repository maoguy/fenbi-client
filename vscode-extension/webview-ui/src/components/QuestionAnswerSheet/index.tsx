// 答卷
import {
  TQuestionData
} from "../../types";

interface TProps {
  questionData:TQuestionData;
}

function QuestionAnswerSheet (props:TProps) {
  const { questionData } = props;
  return (
    <pre>
      {JSON.stringify(questionData,null,2)}
    </pre>
  );
}

export default QuestionAnswerSheet;
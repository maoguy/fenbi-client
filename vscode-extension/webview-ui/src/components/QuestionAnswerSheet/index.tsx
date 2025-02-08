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
    <div>
      <ul>
        {
          questionData?.questions?.map((question)=>{
            const {
              id,
              content,
              accessories
            } = question
            return (
              <li key={id}>
                <div
                  dangerouslySetInnerHTML={{
                    __html:content
                  }}
                />
                <hr/>
                <pre>
                  {JSON.stringify(accessories,null,2)}
                </pre>
              </li>
            );
          })
        }
      </ul>
      <pre>
        {JSON.stringify(questionData,null,2)}
      </pre>
    </div>
  );
}

export default QuestionAnswerSheet;
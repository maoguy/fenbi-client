// 答卷
import React from "react";
import {
  TQuestionData,
  TQuestionItem
} from "../../types";
import Radio from "../Radio";

interface TAnswerPayload {
  questionId:number;
  answerChoice:string;
  questionIndex:number;
}

interface TProps {
  questionData:TQuestionData;
  onChange: (payload:TAnswerPayload)=>void;
}

function QuestionAnswerSheet (props:TProps) {
  const { questionData,onChange } = props;
  const {
    questions=[],
    userAnswers={},
  } = questionData;
  const [ cacheCheckedValue,setCacheCheckedValue ] = React.useState<any>();
  return (
    <div>
      <pre>
        {JSON.stringify(cacheCheckedValue)}
      </pre>
      <ul>
        {
          questions?.map((
            question:TQuestionItem,
            questionIndex:number,
          )=>{
            const {
              id,
              content,
              accessories=[],
              materialIndexes=[]
            } = question
            return (
              <li
                key={id}
              >
                <div
                  style={{
                    display:"flex"
                  }}
                >
                  <span>
                    {questionIndex+1}、
                  </span>
                  <span
                    dangerouslySetInnerHTML={{
                      __html:content
                    }}
                  />
                </div>
                {
                  accessories?.map((accessory,accessoryIndex)=>{
                    let defaultValue = undefined;
                    for(let key in userAnswers){
                      const userAnswer = userAnswers[key];
                      // 遍历userAnswers
                      if(userAnswer.questionId===id){
                        defaultValue = userAnswer?.answer?.choice
                      }
                    }
                    return (
                      <Radio.Group
                        key={`${id}_${accessoryIndex}`}
                        defaultValue={defaultValue}
                        value={defaultValue}
                        onChange={
                          (value)=>{
                            if(value!==undefined){
                              onChange({
                                questionId:id,
                                answerChoice:value,
                                questionIndex:questionIndex
                              })
                            }
                          }
                        }
                      >
                        {
                          accessory?.options?.map((option,optionIndex)=>{
                            const newOption = option.replace(
                              /(<img[^>]+src=\")([^"]+)/g,
                              function (match: any, p1: string, p2: string) {
                                // 如果 src 已经包含 https:，则不修改
                                if (p2.startsWith("https:")) {
                                  return p1 + p2;
                                }
                                // 如果没有 https:，则添加
                                return p1 + "https:" + p2;
                              }
                            );
                            
                            return (
                              <Radio
                                value={optionIndex.toString()}
                              >
                                <span>
                                  {
                                    ["A","B","C","D"][optionIndex]
                                  }
                                  、
                                </span>
                                <span
                                  dangerouslySetInnerHTML={{
                                    __html:newOption
                                  }}
                                />
                              </Radio>
                            );
                          })
                        }
                      </Radio.Group>
                    );
                  })
                }
                <pre>
                  {/* {JSON.stringify(accessories,null,2)} */}
                </pre>
              </li>
            );
          })
        }
      </ul>
      <pre>
        {/* {JSON.stringify(questionData,null,2)} */}
      </pre>
    </div>
  );
}

export default QuestionAnswerSheet;
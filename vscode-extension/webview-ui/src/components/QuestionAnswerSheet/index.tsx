// 答卷
import React from "react";
import {
  TMaterialItem,
  TQuestionData,
  TQuestionItem,
  TSolutionData,
  TSolutionItem
} from "../../types";
import Radio from "../Radio";

export enum TQuestionAnswerSheetTypes {
  QUESTION_MODE="QUESTION_MODE",
  SOLUTION_MODE="SOLUTION_MODE",
};

export interface TAnswerPayload {
  exerciseId:number;
  questionId:number;
  questionIndex:number;
  answerChoice:string;
}

type TProps = {
  fbVscExtConfig?:any;
}&({
  type:TQuestionAnswerSheetTypes.QUESTION_MODE;
  questionData:TQuestionData;
  onChange: (payload:TAnswerPayload)=>void;
} | {
  type:TQuestionAnswerSheetTypes.SOLUTION_MODE;
  solutionData:TSolutionData;
});

function QuestionAnswerSheet (props:TProps) {
  const {
    type,
    fbVscExtConfig={}
  } = props;

  const isJsonShowMode = props?.fbVscExtConfig?.showMode === "JSON";

  const questionData =
    type === TQuestionAnswerSheetTypes.QUESTION_MODE
    ?
    props.questionData
    :
    props.solutionData;


  const {
    exerciseId,
    materials=[],
    userAnswers={},
  } = questionData;

  const questions = type === TQuestionAnswerSheetTypes.QUESTION_MODE
    ?
    props.questionData.questions
    :
    props.solutionData.solutions;



  const materialWithShowIndexList = React.useMemo(()=>{
    const result:(TMaterialItem&{questionIndex:number})[] = [];
    for(let materialIndex=0;materialIndex<materials.length;materialIndex++){
      for(let questionIndex=0;questionIndex<questions.length;questionIndex++){
        if(questions[questionIndex].materialIndexes?.includes(materialIndex)){
          result.push({
            ...materials[materialIndex],
            questionIndex, //将第一个符合条件的questionIndex记下
          });
          break; //跳出里层循环(忽略后面符合条件的question)
        }
      }
    }
    return result;
  },[materials,questions]);

  if(isJsonShowMode){
    return (
      <div>
        <div>{"["}</div>
        <ul>
          {
            questions?.map((
              question:TQuestionItem|TSolutionItem,
              questionIndex:number,
            )=>{
              const {
                id,
                content,
                accessories=[],
                materialIndexes=[],
              } = question
              return (
                <li
                  key={id}
                  style={{
                    margin:"10px 0"
                  }}
                >
                  {
                    materialWithShowIndexList?.filter((material) =>{
                      return material.questionIndex===questionIndex;
                    }).map((material,materialIndex)=>{
                      return (
                        <div
                          key={`material_${materialIndex}`}
                          dangerouslySetInnerHTML={{
                            __html:material.content
                          }}
                        />
                      );
                    })
                  }
                  <div>
                    {"{"}
                  </div>
                  <div>
                    "index":{questionIndex+1},
                  </div>
                  <div>
                    "question":"
                  </div> 
                  <div
                    dangerouslySetInnerHTML={{
                      __html:content
                    }}
                  />
                  <div>
                    ",
                  </div>
                  <div>
                    "options":{"["}
                  </div>
                  {
                    accessories?.map((accessory,accessoryIndex)=>{
                      let defaultValue:any = undefined;
                      for(let key in userAnswers){
                        const userAnswer = userAnswers[key];
                        // 遍历userAnswers
                        if(userAnswer.questionId===id){
                          defaultValue = userAnswer?.answer?.choice
                        }
                      }
                      return (
                        <Radio.Group
                          disabled={type===TQuestionAnswerSheetTypes.SOLUTION_MODE}
                          key={`${id}_${accessoryIndex}`}
                          defaultValue={defaultValue}
                          // value={defaultValue}
                          onChange={
                            (value)=>{
                              if(
                                type===TQuestionAnswerSheetTypes.QUESTION_MODE
                                &&
                                value!==undefined
                              ){
                                props.onChange({
                                  exerciseId,
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
                              
                              let radioChildBackgroup = undefined;
                              if(type===TQuestionAnswerSheetTypes.SOLUTION_MODE){
                                if(optionIndex.toString()===question?.correctAnswer?.choice){
                                  //当前项为正确答案
                                  radioChildBackgroup = "green";
                                }else{
                                  //当前项为错误答案
                                  if(optionIndex.toString()===defaultValue){
                                    //用户选了错误答案
                                    radioChildBackgroup = "red";
                                  }
                                }
                              }

                              return (
                                <Radio
                                  key={optionIndex}
                                  value={optionIndex.toString()}
                                >
                                  <div
                                    style={{
                                      background:radioChildBackgroup
                                    }}
                                  >
                                    "
                                    <span> 
                                      {
                                        ["a","b","c","d"][optionIndex]
                                      }
                                    </span>
                                    .
                                    <span
                                      dangerouslySetInnerHTML={{
                                        __html:newOption
                                      }}
                                    />
                                    ",
                                  </div>
                                </Radio>
                              );
                            })
                          }
                        </Radio.Group>
                      );
                    })
                  }
                  <div>
                    {"]"},
                  </div>
                  {
                    type===TQuestionAnswerSheetTypes.SOLUTION_MODE
                    &&
                    <div
                      style={{
                        border:"2px dashed",
                      }}
                    >
                      <div>
                        "parse":"
                      </div>
                      <div
                        dangerouslySetInnerHTML={{
                          __html:(question as TSolutionItem)?.solution
                        }}
                      />
                      <small>
                        ({(question as TSolutionItem)?.source})
                      </small>
                      <div>
                        "
                      </div>
                    </div>
                  }
                  <div>
                    {"}"},
                  </div>
                </li>
              );
            })
          }
        </ul>
        <div>{"]"}</div>
      </div>
    );
  }

  return (
    <div>
      <ul>
        {
          questions?.map((
            question:TQuestionItem|TSolutionItem,
            questionIndex:number,
          )=>{
            const {
              id,
              content,
              accessories=[],
              materialIndexes=[],
            } = question
            return (
              <li
                key={id}
                style={{
                  margin:"10px 0"
                }}
              >
                {
                  materialWithShowIndexList?.filter((material) =>{
                    return material.questionIndex===questionIndex;
                  }).map((material,materialIndex)=>{
                    return (
                      <div
                        key={`material_${materialIndex}`}
                        dangerouslySetInnerHTML={{
                          __html:material.content
                        }}
                      />
                    );
                  })
                }
                <div
                  style={{
                    display:"flex",
                    margin:"5px 0"
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
                    let defaultValue:any = undefined;
                    for(let key in userAnswers){
                      const userAnswer = userAnswers[key];
                      // 遍历userAnswers
                      if(userAnswer.questionId===id){
                        defaultValue = userAnswer?.answer?.choice
                      }
                    }
                    return (
                      <Radio.Group
                        disabled={type===TQuestionAnswerSheetTypes.SOLUTION_MODE}
                        key={`${id}_${accessoryIndex}`}
                        defaultValue={defaultValue}
                        // value={defaultValue}
                        onChange={
                          (value)=>{
                            if(
                              type===TQuestionAnswerSheetTypes.QUESTION_MODE
                              &&
                              value!==undefined
                            ){
                              props.onChange({
                                exerciseId,
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
                            
                            let radioChildBackgroup = undefined;
                            if(type===TQuestionAnswerSheetTypes.SOLUTION_MODE){
                              if(optionIndex.toString()===question?.correctAnswer?.choice){
                                //当前项为正确答案
                                radioChildBackgroup = "green";
                              }else{
                                //当前项为错误答案
                                if(optionIndex.toString()===defaultValue){
                                  //用户选了错误答案
                                  radioChildBackgroup = "red";
                                }
                              }
                            }

                            return (
                              <Radio
                                key={optionIndex}
                                value={optionIndex.toString()}
                              >
                                <div
                                  style={{
                                    background:radioChildBackgroup
                                  }}
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
                                </div>
                              </Radio>
                            );
                          })
                        }
                      </Radio.Group>
                    );
                  })
                }

                {
                  type===TQuestionAnswerSheetTypes.SOLUTION_MODE
                  &&
                  <div
                    style={{
                      border:"dashed",
                      fontSize:"12px"
                    }}
                  >
                    <div
                      dangerouslySetInnerHTML={{
                        __html:(question as TSolutionItem)?.solution
                      }}
                    />
                    <small>
                      ({(question as TSolutionItem)?.source})
                    </small>
                  </div>
                }
              </li>
            );
          })
        }
      </ul>
    </div>
  );
}

export default QuestionAnswerSheet;
import { useEffect } from "react";
import { useParams,useNavigate } from "react-router-dom";
import { VSCodeButton,VSCodeLink } from "@vscode/webview-ui-toolkit/react";
import useXingceState from "../../hooks/useXingceState";
import QuestionAnswerSheet,{TQuestionAnswerSheetTypes} from "../../components/QuestionAnswerSheet";
import Mask from "../../components/Mask";
import Loading from "../../components/Loading";

function ExercisePage () {
  const navigate = useNavigate();
  const { id } = useParams();
  const {states,methods} = useXingceState();

  const {
    isLoading,
    pageInitData,
    questionData,
    solutionData,
    questionWithAnswerList,
  } = states;

  const {
    fetchQuestionData,
    jumpToFenbiWeb,
    onChangeOfQuestionAnswerSheet,
    submitExercise,
  } = methods;

  useEffect(()=>{
    if(pageInitData){
      fetchQuestionData(parseInt(id as string));
    }
  },[pageInitData?.cache?.exerciseId]);

  const backToMenuElm = (
    <div
      style={{
        display:"flex",
        justifyContent:"space-between",
      }}
    >
      <VSCodeButton
        style={{
          width:"100%"
        }}
        onClick={
          ()=>{
            navigate("/"); //回到首页
          }
        }
      >
        返回菜单
      </VSCodeButton>
    </div>
  );

  return (
    <>
      <main
        style={{
          opacity:pageInitData?.fbVscExtConfig?.opacity,
          fontSize:pageInitData?.fbVscExtConfig?.fontSize,
          color:pageInitData?.fbVscExtConfig?.fontColor,
        }}
      >
        {/* 答题模式 */}
        {
          questionData
          &&
          <div>
            {backToMenuElm}
            {
              solutionData
              ?
              <>
                <QuestionAnswerSheet
                  fbVscExtConfig={pageInitData?.fbVscExtConfig}
                  type={TQuestionAnswerSheetTypes.SOLUTION_MODE}
                  solutionData={solutionData}
                />
                {/* 交卷后的浏览模式 */}
                {
                  solutionData
                  &&
                  <>
                    <div
                      style={{
                        display:"flex",
                        justifyContent:"space-between"
                      }}
                    >
                      <div>
                        答对题目数：{solutionData?.correctCount} /{" "}
                        {solutionData?.questionCount}{" "}
                      </div>
                      <VSCodeLink
                        onClick={jumpToFenbiWeb}
                      >
                        跳转粉笔网址
                      </VSCodeLink>
                    </div>
                    {backToMenuElm}
                  </>
                }
              </>
              :
              <>
                <QuestionAnswerSheet
                  fbVscExtConfig={pageInitData?.fbVscExtConfig}
                  type={TQuestionAnswerSheetTypes.QUESTION_MODE}
                  questionData={questionData}
                  onChange={onChangeOfQuestionAnswerSheet}
                />
                {/* 交卷前的预览模式 */}
                <div>
                  {
                    questionWithAnswerList?.map((question,index)=>{
                      const isAnswer:boolean = question?.userAnswer?.answer?.choice?true:false;
                      return (
                        <div
                          key={question.id}
                          style={{
                            display:"inline-block",
                            width:20,
                            height:20,
                            borderRadius:10,
                            textAlign:"center",
                            margin:5,
                            background:isAnswer?"purple":"grey"
                          }}
                        >
                          {index+1}
                        </div>
                      );
                    })
                  }
                </div>
                <VSCodeButton
                  onClick={submitExercise}
                  style={{width:"100%"}}
                >
                  {
                    questionWithAnswerList?.every((question,index)=>{
                      const isAnswer:boolean = question?.userAnswer?.answer?.choice?true:false;
                      return isAnswer
                    })?"交卷":"强行交卷(未答完)"
                  }
                </VSCodeButton>
              </>
            }
          </div>
        }
      </main>
      {
        isLoading
        &&
        <Loading/>
      }
      {
        pageInitData?.fbVscExtConfig?.isShowMask
        &&
        <Mask
          style={{
            opacity:pageInitData?.fbVscExtConfig.maskOpacity,
            fontSize:pageInitData?.fbVscExtConfig.maskFontSize,
          }}
        />
      }
    </>
  );
}

export default ExercisePage;
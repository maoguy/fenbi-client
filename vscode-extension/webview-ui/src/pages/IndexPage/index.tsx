import { useState,useEffect,useMemo } from "react"
import { vscode } from "../../utils/vscode"
import { VSCodeButton,VSCodeLink } from "@vscode/webview-ui-toolkit/react"
import {
  TPageInitData,
  TQuestionData,
  TLastAnswerRecord,
  TSolutionData,
} from "../../types";
import QuestionCategoryMenu from "../../components/QuestionCategoryMenu";
import QuestionAnswerSheet,{TAnswerPayload, TQuestionAnswerSheetTypes} from "../../components/QuestionAnswerSheet";

function IndexPage() {
  const [isLoading,setIsLoading] = useState<boolean>(false);
  const [pageInitData,setPageInitData] = useState<TPageInitData>();
  const [questionData,setQuestionData] = useState<TQuestionData>();
  const [solutionData,setSolutionData] = useState<TSolutionData>();

  const questionWithAnswerList = useMemo(() => {
    const {
      questions=[],
      userAnswers={}
    } = questionData||{};
    return questions?.map((question,index)=>{
      return {
        ...question,
        userAnswer:userAnswers[index]
      }
    });
  },[questionData?.userAnswers,questionData?.questions]);

  function handleHowdyClick() {
    vscode.postMessage({
      command: "hello",
      text: "Hey there partner! 🤠",
    })
  }

  function enterAnswerSheet (id:number) {
    setIsLoading(true);
    //进入答卷
    let exerciseId:number | null = null;
    if(pageInitData?.cache?.keypointIds?.includes(id)){
      //若用户进入当前正在进行中的试题
      exerciseId = pageInitData?.cache?.exerciseId;
    }
    vscode.postMessage({
      command: "getQuestion",
      postData: { id,exerciseId },
    });
  }

  function handleChangeOfQuestionAnswerSheet (payload: TAnswerPayload) {
    setIsLoading(true);
    const {
      exerciseId,
      questionId,
      questionIndex,
      answerChoice,
    } = payload;

    vscode.postMessage({
      command: "answerQuestion",
      postData: {
        ...payload,
        // time:
      }
    });
  }

  function handleOfSubmitExercise () {
    const {exerciseId} = questionData||{};
    if(exerciseId){
      vscode.postMessage({
        command: "submitExercise",
        postData: {
          exerciseId,
          // time:
        }
      });
    }
  }

  function handleOfAfterSubmitExercise(data:any) {
    setSolutionData(data);
  }

  function jumpToFenbiWeb() {
    const {exerciseId} = questionData||{};
    if(exerciseId){
      vscode.postMessage({
        command: "jumpFenbi",
        postData: {
          exerciseId: questionData?.exerciseId,
        },
      });
    }
  }

  useEffect(()=>{
    setIsLoading(true);
    vscode.postMessage({
      command:"pageInit"
    });

    window.addEventListener("message",(e:MessageEvent)=>{
      const message = e.data||{};
      const { command,data } = message;

      switch(command) {
        case "afterPageInit":
          setIsLoading(false);
          setPageInitData(data);
          break;
        case "afterGetQuestion":
          setIsLoading(false);
          setQuestionData(data);
          break;
        case "afterAnswerQuestion":
          setIsLoading(false);
          break;
        case "afterSubmitExercise":
          setIsLoading(false);
          handleOfAfterSubmitExercise(data);
          break;
        default:
          break;
      }
    })
  },[]);

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
            vscode.postMessage({
              command:"pageInit"
            });
            setQuestionData(undefined); //退出时清空问题数据
            setSolutionData(undefined); //清空答案信息
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
      {/* 菜单模式 */}
      {
        (
          pageInitData
          &&
          (!questionData)
        )  
        &&
        <QuestionCategoryMenu
          pageInitData={pageInitData}
          enterAnswerSheet={enterAnswerSheet}
        />
      }

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
                onChange={handleChangeOfQuestionAnswerSheet}
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
                onClick={handleOfSubmitExercise}
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

      

      
      {/* <VSCodeButton onClick={handleHowdyClick}>Howdy!</VSCodeButton> */}
    </main>
    {
      pageInitData?.fbVscExtConfig?.isShowMask
      &&
      <div
        style={{
          position:"fixed",
          opacity:pageInitData?.fbVscExtConfig.maskOpacity,
          fontSize:pageInitData?.fbVscExtConfig.maskFontSize,
          zIndex:-1,
          top:0,
        }}
      >
        <div
          style={{
            overflowY: 'auto',
            fontFamily: 'monospace',
            lineHeight: 3,
          }}
        >
          <div>[INFO] your extension "fenbi-client" is now active!...</div>
          <div>[INFO] Changed...</div>
          <div>[INFO] Changed...</div>
          <div>[INFO] build started...</div>
          <div>[INFO] ✓ 2 modules transformed.</div>
          <div style={{ color: '#0f0' }}>[SUCCESS] ../extension/dist/contentScripts/style.css            4.21 kB │ gzip:   1.22 kB</div>
          <div>[INFO] Changed...</div>
          <div>[INFO] build started...</div>
          <div>[INFO] ✓ 2 modules transformed.</div>
          <div style={{ color: '#ff0' }}>[WARNING] Deprecated function used in file.js</div>
          <div style={{ color: '#0f0' }}>[SUCCESS] Compilation started...</div>

          
          <div>[INFO] Changed...</div>
          <div>[INFO] Changed...</div>
          <div style={{ color: '#f00' }}>[ERROR] Syntax error in file.js</div>
          <div style={{ color: '#0f0' }}>[SUCCESS] Compilation completed successfully.</div>
          <div>[INFO] Changed...</div>
          <div>[INFO] Changed...</div>
          <div>[INFO] build started...</div>
          <div>[INFO] ✓ 2 modules transformed.</div>
          <div style={{ color: '#0f0' }}>[SUCCESS] ../extension/dist/contentScripts/style.css            4.21 kB │ gzip:   1.22 kB</div>
          <div>[INFO] Changed...</div>
          <div>[INFO] build started...</div>
          <div>[INFO] ✓ 2 modules transformed.</div>
          <div style={{ color: '#ff0' }}>[WARNING] Deprecated function used in file.js</div>
          <div style={{ color: '#0f0' }}>[SUCCESS] Compilation started...</div>

          
          <div>[INFO] Changed...</div>
          <div>[INFO] Changed...</div>
          <div style={{ color: '#f00' }}>[ERROR] Syntax error in file.js</div>
          <div style={{ color: '#0f0' }}>[SUCCESS] Compilation completed successfully.</div>
        </div>
      </div>
    }
    </>
  )
}

export default IndexPage;

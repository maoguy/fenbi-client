// 维护行测相关的状态及其方法
import { useState,useEffect,useMemo } from "react"
import { vscode } from "../../utils/vscode"
import {
  TPageInitData,
  TQuestionData,
  TLastAnswerRecord,
  TSolutionData,
} from "../../types";
import {TAnswerPayload} from "../../components/QuestionAnswerSheet";

function useXingceState () {
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

  function fetchPageInitData () {
    //获取初始化数据
    setIsLoading(true);
    vscode.postMessage({
      command:"pageInit"
    });
  }

  function handleOfAfterSubmitExercise(data:any) {
    setSolutionData(data);
  }

  function onChangeOfQuestionAnswerSheet (payload: TAnswerPayload) {
    //处理问题的回答    
    vscode.postMessage({
      command: "answerQuestion",
      postData: {
        ...payload,
        // time:
      }
    });
  }

  function submitExercise () {
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

  function fetchQuestionData (id:number) {
    //获取问题数据
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

  function jumpToFenbiWeb() {
    //调转到试卷答案详情
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

  function messageHandler (e:MessageEvent) {
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
  }

  useEffect(()=>{
    //注册监听器
    window.addEventListener("message",messageHandler);
    fetchPageInitData();
    return ()=>{
      //卸载监听器
      window.removeEventListener("message",messageHandler);
    }
  },[]);

  return {
    states:{
      isLoading,
      pageInitData,
      questionData,
      solutionData,
      questionWithAnswerList,
    },
    methods:{
      fetchPageInitData,
      fetchQuestionData,
      onChangeOfQuestionAnswerSheet,
      submitExercise,
      jumpToFenbiWeb,
    }
  };
}

export default useXingceState;
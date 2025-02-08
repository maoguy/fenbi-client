import { useState,useEffect } from "react"
import { vscode } from "./utils/vscode"
import { VSCodeButton } from "@vscode/webview-ui-toolkit/react"
import {
  TPageInitData,
  TQuestionData
} from "./types";
import "./App.css"
import QuestionCategoryMenu from "./components/QuestionCategoryMenu";
import QuestionAnswerSheet from "./components/QuestionAnswerSheet";

function App() {
  const [isLoading,setIsLoading] = useState<boolean>(false);
  const [pageInitData,setPageInitData] = useState<TPageInitData>();
  const [questionData,setQuestionData] = useState<TQuestionData>();

  function handleHowdyClick() {
    vscode.postMessage({
      command: "hello",
      text: "Hey there partner! 🤠",
    })
  }

  function enterAnswerSheet (id:number) {
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

  useEffect(()=>{
    vscode.postMessage({
      command:"pageInit"
    });

    window.addEventListener("message",(e:MessageEvent)=>{
      const message = e.data||{};
      const { command,data } = message;

      switch(command) {
        case "pageInit":
          setPageInitData(data);
          break;
        case "getQuestion":
          setQuestionData(data);
          break;
        default:
          break;
      }
    })
  },[]);

  return (
    <main>
      <h1 className="text-lg bg-vscode-panel-border">
        FB I want ni!
      </h1>
      
      {
        pageInitData
        &&
        <QuestionCategoryMenu
          pageInitData={pageInitData}
          enterAnswerSheet={enterAnswerSheet}
        />
      }

      {
        questionData
        &&
        <QuestionAnswerSheet
          questionData={questionData}
        />
      }

      <VSCodeButton onClick={handleHowdyClick}>Howdy!</VSCodeButton>
    </main>
  )
}

export default App

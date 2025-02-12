import * as vscode from "vscode";
import {
  Webview,
} from "vscode";
import {
  getCache,
  getCategories,
  getExerciseId,
  getExercise,
  getQuestions,
  TIncrPayload,
  incr,
  submitExercise,
  getSolution,
} from "../utils/service";

interface TPostMessagePayload {
  command: string;
  data: any;
}

class FenbiWebviewHandler {
  webview:Webview;

  constructor(webview:Webview){
    this.webview=webview;
  }

  postMessage({ command, data }:TPostMessagePayload) {
    setTimeout(()=>{
      this?.webview?.postMessage({
        command,
        data,
      });
    }, 50);
  }

  onDidReceiveMessage() {
    this.webview.onDidReceiveMessage((message)=>{
      const { postData = {}, command = "" } = message;
      switch(command) {
        case "pageInit":
          this.pageInit();
          break;
        case "getQuestion":
          this.getQuestion(postData);
          break;
        case "answerQuestion":
          this.answerQuestion(postData);
          break;
        case "submitExercise":
          this.submitExercise(postData);
          break;
        case "jumpFenbi":
          this.jumpFenbi(postData);
          break;
        default:
          break;
      }
    });
  }
  
  
  async pageInit() {
    try{
      const cacheResult = await getCache();
      const categoriesResult = await getCategories();
      const fbVscExtConfig = vscode.workspace.getConfiguration('fbVscExtConfig');
      
      //通知视图层
      this.webview.postMessage({
        command: "afterPageInit",
        data: {
          cache:cacheResult.data,
          categories:categoriesResult.data,
          fbVscExtConfig, //vscode配置项
        }
      });
    }catch(error){
      vscode.window.showErrorMessage("初始化异常!","查看详情").then((result)=>{
        if(result){
          vscode.window.showErrorMessage(JSON.stringify(error));
        }
      });
    }
  }

  async getQuestion({
    id,exerciseId
  }:{
    id:number;
    exerciseId?: number
  }) {
    try{
      let postExerciseId = exerciseId; // 若命中缓存则取缓存
      if (!postExerciseId){
        // 若无法命中缓存则进行前置请求(更新缓存)
        const res = await getExerciseId({ keypointId: id });
        postExerciseId = res.data.id;
      }

      const exerciseResponse = await getExercise(postExerciseId as number); //用于读取答题记录
      const questionResponse = await getQuestions(postExerciseId as number);

      console.log("exerciseResponse",exerciseResponse);
      console.log("questionResponse",questionResponse);

      //通知视图层
      this.webview.postMessage({
        command: "afterGetQuestion",
        data: {
          exerciseId: postExerciseId,
          questions:questionResponse?.data?.questions||[],
          materials:questionResponse?.data?.materials||[],
          userAnswers:exerciseResponse?.data?.userAnswers||{},
        }
      });
    }catch(error){
      vscode.window.showErrorMessage("获取题目异常!","查看详情").then((result)=>{
        if(result){
          vscode.window.showErrorMessage(JSON.stringify(error));
        }
      });
    }
  }
  async updateStudyTime() {

  }

  async answerQuestion(payload:TIncrPayload) {
    //用户选中某个问题选项
    try{
      const responseOfIncr = await incr(payload);
      if(responseOfIncr.status===200){
        await this.getQuestion({
          id:payload.exerciseId,
          exerciseId:payload.exerciseId,
        });
      }
      //通知视图层
      this.webview.postMessage({
        command: "afterAnswerQuestion",
        data: {
          exerciseId:payload.exerciseId,
        }
      });
    }catch(error){
      vscode.window.showErrorMessage("答题异常!","查看详情").then((result)=>{
        if(result){
          vscode.window.showErrorMessage(JSON.stringify(error));
        }
      });
    }
  }

  async submitExercise({
    exerciseId
  }:{
    exerciseId: number
  }) {
    try{
      const userConfirm = await vscode.window.showInformationMessage("确认交卷?","确认","取消")
      if(userConfirm==="确认"){
        const submitResponse = await submitExercise(exerciseId);
        const exerciseResponse = await getExercise(exerciseId);
        const solutionResponse = await getSolution(exerciseId);
        this.webview.postMessage({
          command: "afterSubmitExercise",
          data: {
            // exerciseData:exerciseResponse?.data,
            // solutionData:solutionResponse?.data,
            // submitData:submitResponse?.data,

            exerciseId: exerciseId,
            solutions: solutionResponse?.data?.solutions||[],
            materials: solutionResponse?.data?.materials||[],
            userAnswers:exerciseResponse?.data?.userAnswers||{},
            correctCount:exerciseResponse?.data?.correctCount,
            questionCount:exerciseResponse?.data?.questionCount,
          }
        })
      }
    }catch(error){
      vscode.window.showErrorMessage("交卷异常!","查看详情").then((result)=>{
        if(result){
          vscode.window.showErrorMessage(JSON.stringify(error));
        }
      });
    }
  }

  jumpFenbi({
    exerciseId
  }:{
    exerciseId: number
  }) {
    try{
      const url = vscode.Uri.parse(
        `https://www.fenbi.com/spa/tiku/report/exam/solution/xingce/xingce/${exerciseId}/2`
      );
      vscode.env.openExternal(url);
    }catch(error){
      vscode.window.showErrorMessage("打开异常!","查看详情").then((result)=>{
        if(result){
          vscode.window.showErrorMessage(JSON.stringify(error));
        }
      });
    }
  }
}

export default FenbiWebviewHandler;
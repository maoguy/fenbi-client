import * as vscode from "vscode";
import {
  getCache,
  getCategories,
  getExercisesId,
  getExercises,
  getQuestions,
} from "../utils/service";
import webview from "../utils/webview";

class WebviewHandler {
  onDidReceiveMessage() {
    webview.onDidReceiveMessage((message)=>{
      const { postData = {}, command = "" } = message;
      switch(command) {
        case "pageInit":
          this.pageInit();
          break;
        case "getQuestion":
          this.getQuestion(postData);
          break;
        case "submit":
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
      //通知视图层
      webview.postMessage({
        command: "pageInit",
        data: {
          cache:cacheResult.data,
          categories:categoriesResult.data,
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
        const res = await getExercisesId({ keypointId: id });
        postExerciseId = res.data.id;
      }

      const exerciseResponse = await getExercises(postExerciseId as number); //用于读取答题记录
      const questionResponse = await getQuestions(postExerciseId as number);

      console.log("exerciseResponse",exerciseResponse);
      console.log("questionResponse",questionResponse);

      webview.postMessage({
        command: "getQuestion",
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

  async submit({
    exerciseId
  }:{
    exerciseId: number
  }) {
    
  }
}

export default WebviewHandler;
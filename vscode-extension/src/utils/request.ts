import * as vscode from "vscode";
import axios from "axios";

function getAixosWithToken () {
  const axiosWithToken = axios.create({
    timeout: 120000, //请求过期时间
  });

  // 统一请求拦截
  axiosWithToken.interceptors.request.use((config)=>{
    const fbVscExtConfig = vscode.workspace.getConfiguration("fbVscExtConfig");
    const {cookie} = fbVscExtConfig;
    if(cookie){
      config.headers["Cookie"] = cookie;
    } else {
      vscode.window.showErrorMessage("未设置 cookie");
    }
    return config;
  },(error)=>Promise.reject(error));

  // 统一响应拦截
  axiosWithToken.interceptors.response.use((resposne)=>{
    return resposne;
  },(error)=>Promise.reject(error));

  return axiosWithToken;
}

export default getAixosWithToken();
import * as vscode from "vscode";

interface TPostMessagePayload {
  command: string;
  data: any;
}

class Webview {
  panel: any;

  init(webviewView: vscode.WebviewView) {
    this.panel = webviewView;
    return webviewView;
  }

  onDidReceiveMessage(callback: (message: { [key: string]: any }) => void) {
    this.panel?.webview.onDidReceiveMessage(callback);
  }

  postMessage({ command, data }:TPostMessagePayload) {
    setTimeout(()=>{
      this.panel?.webview.postMessage({
        command,
        data,
      });
    }, 50);
  }
}

export default new Webview();
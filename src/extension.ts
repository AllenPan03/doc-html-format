import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    "DocHtmlFormat",
    convert
  );
  context.subscriptions.push(disposable);
}

const convert = () => {
  // 获取当前打开的文件的editor
  const editor = vscode.window.activeTextEditor;
  // editor === undefind 表示没有打开的文件
  if (!editor) return;
  let str = "";
  // 当前被选中文本的位置信息数组（实际上就是range组成的数组）
  let selection = editor.selection;
  let text = editor.document.getText(selection);
  let newHtml = text
    .replace(/\w+=("[^"]*"|'[^']*'|'[^']*\n[^']*'|[\w-]*)/g, "")
    .replace(/\w+=([^']*|[^']*\n[^']*|[\w-]*)/g, "")
    .replace(/\s/g, "")
    .replace(/<\/span>/g, "")
    .replace(/<style>(.*?)<\/style>/g, "")
    .replace(/<span>/g, "")
    .replace(
      /<table>/g,
      '<table border="1" cellspacing="0" cellpadding="0" style="width: 100%;">'
    )
    .replace(/&nbsp;/g, "");
  newHtml = newHtml.substring(
    newHtml.indexOf("<body>") + 6,
    newHtml.indexOf("</body>")
  );
  let header =
    "<!DOCTYPE html>\n" +
    '<html lang="en">\n' +
    "<head>\n" +
    '<meta charset="UTF-8">\n' +
    '<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />\n' +
    '<meta http-equiv="Pragma" content="no-cache" />\n' +
    '<meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=no" />\n' +
    "<title></title>\n" +
    '<link rel="stylesheet" href="http://这里输入公共的样式" charset="utf-8">';
  "</head>\n" + "<body>";
  let footer = "</body>\n" + "</html>";
  str = header + "\n" + newHtml + "\n" + footer;
  // 编辑当前文件
  editor.edit((editBuilder) => {
    editBuilder.replace(selection, str);
  });
};

export function deactivate() {}

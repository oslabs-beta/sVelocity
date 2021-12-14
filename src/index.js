//const { ipcRenderer } = window.require('electron');
// var app = new App({
//   target: document.getElementById('editor')
// });
// export default app;
// const openFile = document.getElementById("open-file");
// const textA = document.querySelector('#editor');
// const editor = CodeMirror.fromTextArea(document.querySelector('#editor'), {
//   theme: 'pastel-on-dark',
//   mode: 'javascript',
//   lineNumbers: true,
//   tabSize: 2,
//   value: 'console.log("Hello, World");'
// });

// const editorVal = editor.getValue();
// console.log(editorVal);
// textA.value = openFile.addEventListener("click", async () => {
//   const result = await window.fileHandler.getFileFromUser();
//   return result;
// })

// CodeMirror(document.querySelector('#editor'), {
//   lineNumbers: true,
//   tabSize: 2,
//   value: 'console.log("Hello, World");',
// });

// var myCodeMirror = CodeMirror(
//   function (elt) {
//     myTextArea.parentNode.replaceChild(elt, myTextArea);
//   },
//   { value: myTextArea.value }
// );
// const openFile = document.getElementById('open-file');

// openFile.addEventListener('click', async () => {
//   await window.fileHandler.getFileFromUser();
// });

// var editor = CodeMirror.fromTextArea(document.getElementById("code"), {
//   styleActiveLine: true,
//   lineNumbers: true,
//   matchBrackets: true
// });

// const { ipcRenderer } = win.require('electron');
// // const Store = require('electron-store');
// // const store = new Store();
// // ipcRenderer.on('getFileFromUser', (event, data) => {
// //   store.set('openedFile', data);
// // });
// // console.log("what's this store?", store.get('openedFile'));

// win.fileHandler.getFileFromUser((data) => {
//   console.log(`Received ${data} from main process`);
// });

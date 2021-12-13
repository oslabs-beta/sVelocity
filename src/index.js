// var app = new App({
//   target: document.getElementById('editor')
// });
// export default app;

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
const openFile = document.getElementById('open-file');

openFile.addEventListener('click', async () => {
  await window.fileHandler.getFileFromUser();
});

// var editor = CodeMirror.fromTextArea(document.getElementById("code"), {
//   styleActiveLine: true,
//   lineNumbers: true,
//   matchBrackets: true
// });

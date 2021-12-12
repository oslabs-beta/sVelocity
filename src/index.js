// import App from "./App.svelte";
// // import * as monaco from "monaco-editor";
// // or import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
// // if shipping only a subset of the features & languages is desired

// // let app = monaco.editor.create(document.getElementById("container"), {
// //   value: 'console.log("Hello, world")',
// //   language: "javascript",
// // });
// var app = new App({
//   target: document.getElementById('editor')
// });
// export default app;

CodeMirror(document.querySelector('#editor'), {
  lineNumbers: true,
  tabSize: 2,
  value: 'console.log("Hello, World");'
});

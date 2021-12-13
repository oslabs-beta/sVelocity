// var app = new App({
//   target: document.getElementById('editor')
// });
// export default app;

CodeMirror(document.querySelector('#editor'), {
  lineNumbers: true,
  tabSize: 2,
  value: 'console.log("Hello, World");'
});

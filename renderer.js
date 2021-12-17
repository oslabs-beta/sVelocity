// const { WebpackOptionsValidationError } = require("webpack");
const editor = CodeMirror.fromTextArea(document.querySelector('#editor'), {
  theme: 'pastel-on-dark',
  mode: 'javascript',
  lineNumbers: true,
  tabSize: 2,
  value: 'console.log("Hello, World");',
});



const openFile = document.getElementById('open-file');
const saveFileBtn = document.getElementById('save-file');

document
  .getElementById('toggle-dark-mode')
  .addEventListener('click', async () => {
    const isDarkMode = await window.darkMode.toggle();
    document.getElementById('theme-source').innerHTML = isDarkMode
      ? 'Dark'
      : 'Light';
  });

document
  .getElementById('reset-to-system')
  .addEventListener('click', async () => {
    await window.darkMode.system();
    document.getElementById('theme-source').innerHTML = 'System';
  });

openFile.addEventListener('click', async () => {
  await window.fileHandler.getFileFromUser();

  await window.fileHandler.recieveMessage((content, allFiles) => {
    console.log(allFiles, 'all files are here');
    editor.setValue(content);
  });
});

saveFileBtn.addEventListener('click', async () => {
  //get file contents from codemirror editor
  const editorValue = await editor.getValue();
  //api call with channel(saveFile) and passed-in data
  fileHandler.saveFile('saveFile', editorValue);
  //console.log('EditorRenderer', editorValue);
});

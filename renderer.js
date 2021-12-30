const editor = CodeMirror.fromTextArea(document.querySelector('#editor'), {
  // theme: 'pastel-on-dark',
  mode: 'javascript',
  lineNumbers: true,
  tabSize: 2,
  // width: 450,
  // height: 250,
});

// editor.setSize(500, 300);

const openFile = document.getElementById('open-file');
const saveFileBtn = document.getElementById('save-file');
const seeBrowser = document.getElementById('browser-btn');
const openDev = document.getElementById('devtools-btn');

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

seeBrowser.addEventListener('click', () => {
  const browserURL = document.getElementById('url-field').value;
  console.log(browserURL);
  window.browserView.getInputUrl('getInputUrl', browserURL);
})

openFile.addEventListener('click', async () => {
  // const file = 
  await window.fileHandler.getFileFromUser();
  await window.fileHandler.recieveMessage((content) => {
    console.log("console logging from the renderer:", content);
    editor.setValue(content);
  });
});

saveFileBtn.addEventListener('click', async () => {
  //get file contents from codemirror editor
  const editorValue = await editor.getValue();
  //api call with channel(saveFile) and passed-in data
  fileHandler.saveFile('saveFile', editorValue);
});

openDev.addEventListener('click', async () => {
  devToolsHandler.openDevTools('openDevTools');
})
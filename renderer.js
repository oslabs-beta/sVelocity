const editor = CodeMirror.fromTextArea(document.querySelector('#editor'), {
  mode: 'javascript',
  lineNumbers: true,
  tabSize: 2,
});

const openFile = document.getElementById('open-file');
const saveFileBtn = document.getElementById('save-file');
const newFileBtn = document.getElementById('new-file');
const lastViewed = [];
const seeBrowser = document.getElementById('browser-btn');
const openDev = document.getElementById('devtools-btn');

document.getElementById('toggle-dark-mode').addEventListener('click', () => {
  window.darkMode.toggle();
});

// document
//   .getElementById('reset-to-system')
//   .addEventListener('click', () => {
//   window.darkMode.system();
//   });

openFile.addEventListener('click', () => {
  window.fileHandler.getFileFromUser();
});

window.fileHandler.recieveMessage((content, allFiles) => {
  const allData = allFiles;
  const self = allData[allData.length - 1];

  if (lastViewed.length >= 2) {
    lastViewed.shift();
  }
  lastViewed.push(self.filename);

  const ul = document.getElementsByTagName('UL');
  const tab = document.createElement('li');
  const txt = document.createElement('h5');
  const btn = document.createElement('button');

  txt.innerText = `${self.filename}`;
  btn.innerText = 'x';
  tab.setAttribute('class', self.active);
  txt.setAttribute('class', 'text');
  btn.setAttribute('class', 'close');
  tab.appendChild(txt);
  tab.appendChild(btn);

  const tabs = document.getElementsByTagName('LI');
  self.active = true;

  txt.addEventListener('click', () => {
    editor.setValue(self.editor.value);
    allData.forEach((obj) => {
      if (obj !== self) {
        obj.active = false;
      } else {
        obj.active = true;
      }
    });
  });

  btn.addEventListener('click', () => {
    if (tabs.length <= 1) {
      editor.setValue('');
      self.active = false;
      tab.remove();
    } else {
      console.log('lastviewed', lastViewed);
      if (self.active) {
        self.active = false;
        const lastViewedFile = allData.find(
          (obj) => obj.filename === lastViewed[0]
        );
        editor.setValue(lastViewedFile.editor.value);
        lastViewedFile.active = true;
      } else {
      }
      tab.remove();
    }
    allData.splice(allData.indexOf(self), 1);
  });
  ul[0].appendChild(tab);
  editor.setValue(content);
});

seeBrowser.addEventListener('click', () => {
  const browserURL = document.getElementById('url-field').value;
  console.log(browserURL);
  window.browserView.getInputUrl('getInputUrl', browserURL);
});

// openFile.addEventListener('click', async () => {
//   // const file =
//   await window.fileHandler.getFileFromUser();
//   await window.fileHandler.recieveMessage((content) => {
//     console.log("console logging from the renderer:", content);
//     editor.setValue(content);
//   });
//

saveFileBtn.addEventListener('click', async () => {
  const editorValue = await editor.getValue();

  fileHandler.saveFile('saveFile', editorValue);
});

newFileBtn.addEventListener('click', async () => {
  //const editorValue = await editor.getValue();
  const ul = document.getElementsByTagName('UL');
  //const form = document.createElement('form');
  const input = document.createElement('input');
  //form.setAttribute('id', 'form');
  input.setAttribute('type', 'text');
  input.setAttribute('id', 'input');
  // form.addEventListener(('sbmit')=> {

  // });
  ul[0].appendChild(input);

  const fileName = 'hello.js';

  fileHandler.newFile('createFile', fileName);
});

openDev.addEventListener('click', async () => {
  devToolsHandler.openDevTools('openDevTools');
});

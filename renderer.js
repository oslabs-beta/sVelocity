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
  const selfies = allData[allData.length - 1];

  if (lastViewed.length >= 2) {
    lastViewed.shift();
  }
  lastViewed.push(selfies.filename);

  const ul = document.getElementsByTagName('UL');
  const tab = document.createElement('li');
  const txt = document.createElement('h5');
  const btn = document.createElement('button');

  txt.innerText = `${selfies.filename}`;
  btn.innerText = 'x';
  tab.setAttribute('class', selfies.active);
  txt.setAttribute('class', 'text');
  btn.setAttribute('class', 'close');
  tab.appendChild(txt);
  tab.appendChild(btn);

  const tabs = document.getElementsByTagName('LI');
  selfies.active = true;

  txt.addEventListener('click', () => {
    editor.setValue(selfies.editor.value);
    allData.forEach((obj) => {
      if (obj !== selfies) {
        obj.active = false;
        //txt.parentNode.setAttribute('class', obj.active);
      } else {
        obj.active = true;
      }
    });
    // document.querySelector('.true').removeAttribute('class', 'true');
    // const removeActive = document.getElementsByClassName('true');
    // removeActive.removeAttribute('active');
    // txt.parentNode.setAttribute('class', 'true');
    if (document.querySelector('.true') === null) {
      txt.parentNode.setAttribute('class', true);
    } else {
      const activeToFalse = document.querySelector('.true');
      activeToFalse.removeAttribute('class', 'true');
      activeToFalse.setAttribute('class', false);
      txt.parentNode.setAttribute('class', true);
    }
    // document
    //   .querySelector('.true')
    //   .removeAttribute('class', 'true')
    //   .setAttribute('class', true);
  });

  btn.addEventListener('click', () => {
    if (tabs.length <= 1) {
      editor.setValue('');
      selfies.active = false;
      tab.remove();
    } else {
      console.log('lastviewed', lastViewed);
      if (selfies.active) {
        selfies.active = false;
        const lastViewedFile = allData.find(
          (obj) => obj.filename === lastViewed[0]
        );
        editor.setValue(lastViewedFile.editor.value);
        lastViewedFile.active = true;
      } else {
      }
      tab.remove();
    }
    allData.splice(allData.indexOf(selfies), 1);
  });
  ul[0].appendChild(tab);
  editor.setValue(content);
});

seeBrowser.addEventListener('click', () => {
  const browserURL = document.getElementById('url-field').value;
  console.log(browserURL);
  window.browserView.getInputUrl('getInputUrl', browserURL);
});

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

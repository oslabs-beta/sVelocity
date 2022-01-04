const editor = CodeMirror.fromTextArea(document.querySelector('#editor'), {
  mode: 'javascript',
  lineNumbers: true,
  tabSize: 2,
});

const openFile = document.getElementById('open-file');
const saveFileBtn = document.getElementById('save-file');
const newFileBtn = document.getElementById('new-file');
const lastViewed = new Set();
const seeBrowser = document.getElementById('browser-btn');
const openDev = document.getElementById('devtools-btn');

document.getElementById('toggle-dark-mode').addEventListener('click', () => {
  window.darkMode.toggle();
});

openFile.addEventListener('click', () => {
  window.fileHandler.getFileFromUser();
});

window.fileHandler.recieveMessage((content, allFiles) => {
  console.log('openfile button clicked - lastviewed', lastViewed);
  //open file
  const allData = allFiles;
  const selfObj = allData[allData.length - 1];

  // if (lastViewed.length >= 2) {
  //   lastViewed.shift();
  // }
  lastViewed.add(selfObj.filename);

  const ul = document.getElementsByTagName('UL');
  const tab = document.createElement('li');
  const txt = document.createElement('h5');
  const btn = document.createElement('button');

  txt.innerText = `${selfObj.filename}`;
  btn.innerText = 'x';
  tab.setAttribute('class', true);
  txt.setAttribute('class', 'text');
  btn.setAttribute('class', 'close');
  tab.appendChild(txt);
  tab.appendChild(btn);

  const tabs = document.getElementsByTagName('LI');
  selfObj.active = true;

  if (document.querySelector('.true') === null) {
    txt.parentNode.setAttribute('class', true);
    if (lastViewed.has(self)) {
    }
  } else {
    const activeToFalse = document.querySelector('.true');
    activeToFalse.removeAttribute('class', 'true');
    activeToFalse.setAttribute('class', false);
    txt.parentNode.setAttribute('class', true);
  }

  txt.addEventListener('click', () => {
    //click file
    lastViewed.delete(selfObj.filename);
    lastViewed.add(selfObj.filename);
    console.log('clicked tab text - lastviewed', lastViewed);
    editor.setValue(selfObj.editor.value);
    allData.forEach((obj) => {
      if (obj !== selfObj) {
        obj.active = false;
      } else {
        obj.active = true;
      }
    });

    if (document.querySelector('.true') === null) {
      txt.parentNode.setAttribute('class', true);
    } else {
      const activeToFalse = document.querySelector('.true');
      activeToFalse.removeAttribute('class', 'true');
      activeToFalse.setAttribute('class', false);
      txt.parentNode.setAttribute('class', true);
    }
  });

  //closing tab functionality
  btn.addEventListener('click', () => {
    //if tab to be closed is last tab, reset editor to empty, turn active to false and remove tab
    if (tabs.length <= 1) {
      editor.setValue('');
      selfObj.active = false;
      tab.remove();
      //if tab not last, set active to false, remove from recently viewed queue, set as active tab the most recently viewed tab and set editor to corresponding editor content.
    } else {
      if (selfObj.active) {
        selfObj.active = false;
        lastViewed.delete(selfObj.filename);
        console.log('close tab button clicked - lastviewed', lastViewed);
        const activeFile = allData.find(
          (obj) => obj.filename === [...lastViewed][lastViewed.size - 1]
        );
        const tabs = document.getElementsByTagName('LI');
        console.log(tabs);
        for (let i = 0; i < tabs.length; i++) {
          // console.log(tabs[i].innerText);
          if (tabs[i].innerText.slice(0, -1) === activeFile.filename) {
            tabs[i].removeAttribute('class', false);
            tabs[i].setAttribute('class', true);
            break;
          }
        }
        console.log(activeFile);
        editor.setValue(activeFile.editor.value);
        activeFile.active = true;
      } else {
        lastViewed.delete(selfObj.filename);
        console.log('close tab button clicked - lastviewed', lastViewed);
      }

      tab.remove();
    }
    allData.splice(allData.indexOf(selfObj), 1);
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
  const form = document.createElement('form');
  const input = document.createElement('input');
  form.setAttribute('id', 'form');
  input.setAttribute('type', 'text');
  input.setAttribute('id', 'tabInput');
  //let inputForm = document.getElementById('form');

  // form.addEventListener('keypress', function (e) {
  //   if (e.key === 13) {
  //     e.preventDefault();

  //     // code for enter
  //     console.log(hello);
  //     ul[0].removeChild(inputForm);
  //     //form.setAttribute('display', 'none');
  //   }
  // });
  // form.appendChild(input);
  //const textInputValue = document.getElementById('tabInput').value;

  ul[0].appendChild(input);

  const fileName = 'hello.js';

  fileHandler.newFile('createFile', fileName);
});

openDev.addEventListener('click', async () => {
  devToolsHandler.openDevTools('openDevTools');
});

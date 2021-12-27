// var editors = document.getElementsByClassName('editor');
// for (var i = 0; i < editors.length; i++) {
//   var self = editors[i];
//   var editor = CodeMirror.fromTextArea(self, {
//     mode: 'javascript',
//     lineNumbers: true,
//     autoRefresh: true,
//   });
//   editor.save();
// }

// var tabs = document.querySelectorAll('.tab');

// for (var i = 0; i < tabs.length; i++) {
//   var self = tabs[i];
//   self.addEventListener('click', function () {
//     var data = this.getAttribute('data-tab');
//     document.querySelectorAll('.tab-pane.active')[0].classList.remove('active');
//     document
//       .querySelectorAll('.tab-pane[data-pane="' + data + '"]')[0]
//       .classList.add('active');
//     document.querySelectorAll('.tab.active')[0].classList.remove('active');
//     this.classList.add('active');
//   });
// }

// let store = [];

// let editors = store.forEach((obj) => {
//   CodeMirror.fromTextArea(document.querySelector('#editor'), obj.editor);
// });

// const tabs = store.forEach((obj) => {
//   return obj.filename;
// });

// function createDomElement(innerText, attribute, attributeVal) {
//   const ul = document.getElementsByTagName('UL');
//   const tab = document.createElement('li');
//   tab.innerText = `${innerText}`;
//   tab.setAttribute(attribute, attributeVal);
//   ul.appendChild(tab);
// }

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
    //you need to store the data from message (allFiles) in a new variable, otherwise no access to them
    const allData = allFiles;
    const self = allData[allData.length - 1];
    console.log(self, 'self');
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
    txt.addEventListener('click', () => {
      console.log('hoy');
      editor.setValue(self.editor.value);
    });
    btn.addEventListener('click', () => {
      if (tabs.length <= 1) {
        editor.setValue('');
        console.log('hi');
        tab.remove();
      } else {
        console.log('hey');
        tab.remove();
        //editor.setValue(ul[ul.length - 1]);
      }
    });
    ul[0].appendChild(tab);
    console.log('heya');
    editor.setValue(content);
  });
});

saveFileBtn.addEventListener('click', async () => {
  const editorValue = await editor.getValue();

  fileHandler.saveFile('saveFile', editorValue);
});

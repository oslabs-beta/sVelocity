const editor = CodeMirror.fromTextArea(document.querySelector('#editor'), {
  theme: 'pastel-on-dark',
  mode: 'javascript',
  lineNumbers: true,
  tabSize: 2,
  value: 'console.log("Hello, World");',
});

const openFile = document.getElementById('open-file');
const saveFileBtn = document.getElementById('save-file');
const lastViewed = [];

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

openFile.addEventListener('click', () => {
  window.fileHandler.getFileFromUser();
});

window.fileHandler.recieveMessage((content, allFiles) => {
  console.log(allFiles, 'all files are here');

  console.log('lastViewed after push', lastViewed);
  //you need to store the data from message (allFiles) in a new variable, otherwise no access to them
  const allData = allFiles;
  const self = allData[allData.length - 1];
  //console.log(self, 'self');

  // if (lastViewed.length > 2) {
  //   //console.log('removed');

  //   lastViewed.shift();
  //   console.log('after unshift', lastViewed);
  // }
  // lastViewed.push(self.filename);

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
  //on opening file make new tab active and add to lastViewed array
  self.active = true;
  //check lastViewed array and if two items presents remove last one and add current as first

  //when clicking on Tab
  txt.addEventListener('click', () => {
    console.log('tab event listener');
    //show editor instance
    editor.setValue(self.editor.value);
    //set all other tabs to non-active
    //set current tab active
    allData.forEach((obj) => {
      if (obj !== self) {
        obj.active = false;
      } else {
        obj.active = true;
      }
    });

    console.log('lastViewed updated', lastViewed);
    console.log('updated allData (active)', allData);
  });

  //when close button clicked
  btn.addEventListener('click', () => {
    console.log('close button event listener');
    //if last tab is closed fall back to empty editor instance
    if (tabs.length <= 1) {
      editor.setValue('');
      console.log('hi');
      //set closed tab to non-active and remove it
      self.active = false;
      tab.remove();
    } else {
      console.log('hey');
      //if not last tab and tab was active (was currently viewed), set tab to non-active
      if (self.active) {
        self.active = false;
        //show last viewed tab content and set that to active
        const lastViewedFile = allData.find(
          (obj) => obj.filename === lastViewed[1]
        );
        editor.setValue(lastViewedFile.editor.value);
        lastViewedFile.active = true;
      }
      //if not last tab and tab was non-active (not currently viewed)
      else {
      }
      //set closed tab to non-active and remove it
      tab.remove();
    }
    //remove tab from allData (files array)

    allData.splice(allData.indexOf(self), 1);
    console.log('updated allData', allData);
  });
  console.log('tabbbbbbbbb', tab);
  ul[0].appendChild(tab);
  editor.setValue(self.editor.value);
});

saveFileBtn.addEventListener('click', async () => {
  const editorValue = await editor.getValue();

  fileHandler.saveFile('saveFile', editorValue);
});

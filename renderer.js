const editor = CodeMirror.fromTextArea(document.querySelector('#editor'), {
  mode: 'javascript',
  lineNumbers: true,
  tabSize: 2,
});

let dataFromStore;

const openFile = document.getElementById('open-file');
const saveFileBtn = document.getElementById('save-file');
const newFileBtn = document.getElementById('new-file');
const lastViewed = new Set();
const seeBrowser = document.getElementById('browser-btn');
const openDev = document.getElementById('devtools-btn');

document.getElementById('toggle-dark-mode').addEventListener('click', () => {
  window.darkMode.toggle();
});

document.onkeydown = function (evt) {
  evt = evt || window.event;
  var isEscape = false;
  const input = document.getElementById('tabInput');
  const ul = document.getElementsByTagName('UL');
  if ('key' in evt) {
    isEscape = evt.key === 'Escape' || evt.key === 'Esc';
  } else {
    isEscape = evt.key === 27;
  }
  if (isEscape && input) {
    ul[0].removeChild(input);
  }
};

openFile.addEventListener('click', () => {
  window.fileHandler.getFileFromUser();
});

window.fileHandler.recieveMessage((content, allFiles) => {
  //open file functionality
  //copy store Data to var. allData (electron quirk)
  dataFromStore = allFiles;
  const allData = dataFromStore;
  //get the current item (obj)
  const selfObj = allData[allData.length - 1];
  //add item (now active) on the recently viewed queue
  lastViewed.add(selfObj.filename);

  //create a tab dom element with text (filename) and closing button and append to dom
  const ul = document.getElementsByTagName('UL');
  const tab = document.createElement('li');
  const txt = document.createElement('h5');
  const btn = document.createElement('button');

  txt.innerText = `${selfObj.filename}`;
  btn.innerText = 'X';
  tab.setAttribute('class', true);
  txt.setAttribute('class', 'text');
  btn.setAttribute('class', 'close');
  tab.appendChild(txt);
  tab.appendChild(btn);

  //get list of tabs
  const tabs = document.getElementsByTagName('LI');
  //set active property of current obj to true
  selfObj.active = true;

  //if no other tabs are active then set tab class to active (true)
  if (document.querySelector('.true') === null) {
    txt.parentNode.setAttribute('class', true);
  } else {
    //else select the previously active tab, change it to false and set the new tab to active true
    const activeToFalse = document.querySelector('.true');
    activeToFalse.removeAttribute('class', 'true');
    activeToFalse.setAttribute('class', false);
    txt.parentNode.setAttribute('class', true);
  }

  txt.addEventListener('click', () => {
    //click file functionality
    //remove clicked tab from recently viewed queue and re-insert it so that the order is correct
    lastViewed.delete(selfObj.filename);
    lastViewed.add(selfObj.filename);

    //show obj editor value
    editor.setValue(selfObj.editor.value);

    //go through the data array, turn active: false  properties on all the other objs and active on the current obj
    allData.forEach((obj) => {
      if (obj !== selfObj) {
        obj.active = false;
      } else {
        obj.active = true;
      }
    });
    //check if there is a tab with an active class (true) and if not then set current tab to true
    if (document.querySelector('.true') === null) {
      txt.parentNode.setAttribute('class', true);
    } else {
      //get the active tab, deactivate it and set current tab class to active (true)
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

      //remove obj from allData array
      //allData.splice(allData.indexOf(selfObj), 1);
      //if tab not last, set active property to false, remove from recently viewed queue, set as active tab the most recently viewed tab and set editor to corresponding editor content.
    } else {
      //if current obj property is active then deactivate it and delete filename from recently viewed queue
      const parentActiveTab = btn.closest('.true');

      if (Boolean(parentActiveTab)) {
        selfObj.active = false;
        lastViewed.delete(selfObj.filename);

        //search the obj that is the last viewed item
        //bug: store here doesn't have both items (newFiles)
        const activeFile = allData.find(
          (obj) => obj.filename == [...lastViewed][lastViewed.size - 1]
        );

        const tabs = document.getElementsByTagName('LI');

        //set the tab class corresponding to that obj to active true
        for (let i = 0; i < tabs.length; i++) {
          if (tabs[i].innerText.slice(0, -1) === activeFile.filename) {
            tabs[i].removeAttribute('class', false);
            tabs[i].setAttribute('class', true);
            break;
          }
        }

        //set the editor value to the last viewed obj
        editor.setValue(activeFile.editor.value);
        //turn property active true on the obj
        activeFile.active = true;
      } else {
        //if current obj active property false then just remove it's filename from last visited queue
        lastViewed.delete(selfObj.filename);
      }
      //delete tab
      tab.remove();
    }
    //remove obj from allData array
    allData.splice(allData.indexOf(selfObj), 1);
  });

  //append tab to ul dom parent
  ul[0].appendChild(tab);
  //set the editor value to the curret obj editor value
  editor.setValue(content);
});

seeBrowser.addEventListener('click', () => {
  const browserURL = document.getElementById('url-field').value;
  window.browserView.getInputUrl('getInputUrl', browserURL);
});

saveFileBtn.addEventListener('click', async () => {
  try {
    const activeTab = document.querySelector('.true');
    const editorValue = await editor.getValue();
    const fileName = activeTab.innerText.slice(0, -1);
    fileHandler.saveFile('saveFile', editorValue, fileName);
  } catch (error) {
    console.log('error', error);
  }
});

//new File button event listener triggers
newFileBtn.addEventListener('click', async () => {
  //create new file functionality
  //create input field on ul dom parent so that the new filename can be set
  const ul = document.getElementsByTagName('UL');
  const input = document.createElement('input');

  input.setAttribute('type', 'text');
  input.setAttribute('id', 'tabInput');
  ul[0].appendChild(input);

  //input event listener is triggered by enter key action and invokes main.js filehandler is invoked passing the filename which creates a file in the users filesystem
  input.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      fileHandler.newFile('createFile', input.value);
      //remove input field from dom
      ul[0].removeChild(input);
    }
  });
});

window.fileHandler.receiveNewFileData((allFiles) => {
  //copy store Data to var. allData (electron quirk)
  dataFromStore = allFiles;
  const allDataNewFile = dataFromStore;

  //get the current item (obj) and delete it from last viewed queue
  const selfObject = allDataNewFile[allDataNewFile.length - 1];
  lastViewed.add(selfObject.filename);

  //create a new tab according to user's input with text (filename) and closing button
  const ul = document.getElementsByTagName('UL');
  const tab = document.createElement('li');
  const txt = document.createElement('h5');
  const btn = document.createElement('button');

  txt.innerText = `${selfObject.filename}`;
  btn.innerText = 'X';
  tab.setAttribute('class', true);
  txt.setAttribute('class', 'text');
  btn.setAttribute('class', 'close');
  tab.appendChild(txt);
  tab.appendChild(btn);

  //get list of all tabs
  const tabs = document.getElementsByTagName('LI');

  //set active property of current obj to true
  selfObject.active = true;

  //if no other tabs are active then set tab class to active (true)
  if (document.querySelector('.true') === null) {
    txt.parentNode.setAttribute('class', true);
  } else {
    //else select the previously active tab, change it to false and set the new tab to active true
    const activeToFalse = document.querySelector('.true');
    activeToFalse.removeAttribute('class', 'true');
    activeToFalse.setAttribute('class', false);
    txt.parentNode.setAttribute('class', true);
  }
  //add item (now active) on the recently viewed queue
  lastViewed.add(tab.innerText.slice(0, -1));

  txt.addEventListener('click', () => {
    //click file functionality
    //remove clicked tab from recently viewed queue and re-insert it so that the order is correct
    lastViewed.delete(txt.parentNode.innerText.slice(0, -1));
    lastViewed.add(txt.parentNode.innerText.slice(0, -1));

    //show obj editor value
    editor.setValue(selfObject.editor.value);

    //go through the data array, turn active: false  properties on all the other objs and active on the current obj
    allDataNewFile.forEach((obj) => {
      if (obj !== selfObject) {
        obj.active = false;
      } else {
        obj.active = true;
      }
    });
    //check if there is a tab with an active class (true) and if not then set current tab to true
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
      tab.remove();
      //if tab not last, set active to false, remove from recently viewed queue, set as active tab the most recently viewed tab and set editor to corresponding editor content.
    } else {
      //if tab to be close is active
      const parentActiveTab = btn.closest('.true');
      if (Boolean(parentActiveTab)) {
        selfObject.active = false;
        lastViewed.delete(parentActiveTab.innerText.slice(0, -1));

        const activeFile = allDataNewFile.find(
          (obj) => obj.filename == [...lastViewed][lastViewed.size - 1]
        );

        const tabs = document.getElementsByTagName('LI');

        for (let i = 0; i < tabs.length; i++) {
          if (
            tabs[i].innerText.slice(0, -1) ===
            [...lastViewed][lastViewed.size - 1]
          ) {
            tabs[i].removeAttribute('class', false);
            tabs[i].setAttribute('class', true);
            break;
          }
        }
        editor.setValue(activeFile.editor.value);
        activeFile.active = true;
        //else (non-active tab)
      } else {
        const parentTab = btn.parentNode;
        lastViewed.delete(parentTab.innerText.slice(0, -1));
      }
      tab.remove();
    }
  });
  ul[0].appendChild(tab);
  editor.setValue(selfObject.editor.value);
});

openDev.addEventListener('click', async () => {
  devToolsHandler.openDevTools('openDevTools');
});

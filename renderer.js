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

openFile.addEventListener('click', () => {
  window.fileHandler.getFileFromUser();
});

window.fileHandler.recieveMessage((content, allFiles) => {
  console.log('openfile button clicked - lastviewed', lastViewed);
  //open file functionality
  //copy store Data to var. allData (electron quirk)
  dataFromStore = allFiles;
  const allData = dataFromStore;
  //get the current item (obj)
  const selfObj = allData[allData.length - 1];
  //add item (now active) on the recently viewed queue
  lastViewed.add(selfObj.filename);
  console.log(allData, 'aaaaaallllData');
  //create a tab dom element with text (filename) and closing button and append to dom
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
    console.log('clicked tab text - lastviewed', lastViewed);
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
      //if tab not last, set active property to false, remove from recently viewed queue, set as active tab the most recently viewed tab and set editor to corresponding editor content.
    } else {
      console.log(selfObj, 'self obj');
      //console.log(allData, 'allData');
      //if current obj property is active then deactivate it and delete filename from recently viewed queue
      if (selfObj.active) {
        selfObj.active = false;
        lastViewed.delete(selfObj.filename);
        //console.log('close tab button clicked - lastviewed', lastViewed);
        //console.log(alldata, 'alldata');
        console.log(allData, 'allData1');
        console.log(lastViewed, 'lastviewed');
        console.log([...lastViewed][lastViewed.size - 1], 'lastviewed item');

        //search the obj that is the last viewed item
        //bug: store here doesn't have both items (newFiles)
        const activeFile = allData.find((obj) => {
          obj.filename === [...lastViewed][lastViewed.size - 1];
        });

        console.log(activeFile, 'activefile');
        const tabs = document.getElementsByTagName('LI');
        //console.log(tabs);
        //set the tab class corresponding to that obj to active true
        for (let i = 0; i < tabs.length; i++) {
          if (tabs[i].innerText.slice(0, -1) === activeFile.filename) {
            tabs[i].removeAttribute('class', false);
            tabs[i].setAttribute('class', true);
            break;
          }
        }
        //console.log(activeFile);
        //set the editor value to the last viewed obj
        editor.setValue(activeFile.editor.value);
        //turn property active true on the obj
        activeFile.active = true;
      } else {
        //if current obj active property false then just remove it's filename from last visited queue
        lastViewed.delete(selfObj.filename);
        console.log('close tab button clicked - lastviewed', lastViewed);
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
  console.log(browserURL);
  window.browserView.getInputUrl('getInputUrl', browserURL);
});

saveFileBtn.addEventListener('click', async () => {
  const editorValue = await editor.getValue();

  fileHandler.saveFile('saveFile', editorValue);
});

//newFileBtn.addEventListener('click', ()

//new File button event listener triggers
newFileBtn.addEventListener('click', async () => {
  //create new file functionality
  //create input field on ul dom parent so that the new filename can be set
  const ul = document.getElementsByTagName('UL');
  // const form = document.createElement('form');
  const input = document.createElement('input');
  // form.setAttribute('id', 'form');
  input.setAttribute('type', 'text');
  input.setAttribute('id', 'tabInput');
  ul[0].appendChild(input);

  //input event listener is triggered by enter key action and invokes main.js filehandler is invoked passing the filename which creates a file in the users filesystem
  input.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
      console.log(input.value);
      console.log('lolsssssssssssssss');
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
  console.log(allDataNewFile, 'allDataNewFile');
  //get the current item (obj)
  const selfObject = allDataNewFile[allDataNewFile.length - 1];
  lastViewed.add(selfObject.filename);
  console.log(lastViewed, 'lastviewed from createfile');
  //create a new tab according to user's input with text (filename) and closing button
  const ul = document.getElementsByTagName('UL');
  const tab = document.createElement('li');
  const txt = document.createElement('h5');
  const btn = document.createElement('button');

  txt.innerText = `${selfObject.filename}`;
  btn.innerText = 'x';
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
    // console.log('close tab button clicked - lastviewed', lastViewed);
  } else {
    //else select the previously active tab, change it to false and set the new tab to active true
    const activeToFalse = document.querySelector('.true');
    activeToFalse.removeAttribute('class', 'true');
    activeToFalse.setAttribute('class', false);
    txt.parentNode.setAttribute('class', true);
    console.log('close tab button clicked - lastviewed', lastViewed);
  }
  //add item (now active) on the recently viewed queue
  lastViewed.add(tab.innerText.slice(0, -1));

  txt.addEventListener('click', () => {
    //click file functionality
    //remove clicked tab from recently viewed queue and re-insert it so that the order is correct
    lastViewed.delete(txt.parentNode.innerText.slice(0, -1));
    lastViewed.add(txt.parentNode.innerText.slice(0, -1));
    console.log('clicked tab text - lastviewed', lastViewed);
    //editor.setValue(selfObj.editor.value);
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
    console.log('close tab button clicked - lastviewed', lastViewed);

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
        console.log('close tab button clicked - lastviewed', lastViewed);

        const tabs = document.getElementsByTagName('LI');
        console.log(tabs);
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
        //else (non-active tab)
      } else {
        const parentTab = btn.parentNode;
        lastViewed.delete(parentTab.innerText.slice(0, -1));
        console.log('close tab button clicked - lastviewed', lastViewed);
      }
      tab.remove();
    }
  });
  ul[0].appendChild(tab);
});
//});

openDev.addEventListener('click', async () => {
  devToolsHandler.openDevTools('openDevTools');
});

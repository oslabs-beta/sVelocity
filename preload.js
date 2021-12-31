const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('darkMode', {
  toggle: () => ipcRenderer.invoke('dark-mode:toggle'),
  system: () => ipcRenderer.invoke('dark-mode:system'),
});

contextBridge.exposeInMainWorld(
  'fileHandler',
  {
    getFileFromUser: (event) => ipcRenderer.invoke('getFileFromUser'),
    recieveMessage: (callback) =>
      ipcRenderer.on(
        'eventFromMain',
        async function (event, content, allFiles) {
          await callback(content, allFiles);
        }
      ),
    saveFile: (channel, editorValue) =>
      ipcRenderer.invoke('saveFile', editorValue),
    newFile: (channel, fileName) => ipcRenderer.invoke('createFile', fileName),
  },
  false
);

window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector);
    if (element) element.innerText = text;
  };

  for (const dependency of ['chrome', 'node', 'electron']) {
    replaceText(`${dependency}-version`, process.versions[dependency]);
  }
});

const { contextBridge, ipcRenderer } = require('electron');
const { remote } = require('electron');

contextBridge.exposeInMainWorld('darkMode', {
  toggle: () => ipcRenderer.invoke('dark-mode:toggle'),
  system: () => ipcRenderer.invoke('dark-mode:system'),
});

contextBridge.exposeInMainWorld(
  'fileHandler',
  {
    getFileFromUser: () => ipcRenderer.invoke('getFileFromUser'),
    saveFile: (channel, editorValue) =>
      ipcRenderer.invoke('saveFile', editorValue),
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

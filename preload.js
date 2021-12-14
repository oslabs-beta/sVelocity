const { contextBridge, ipcRenderer, ipcMain } = require('electron');

contextBridge.exposeInMainWorld('darkMode', {
  toggle: () => ipcRenderer.invoke('dark-mode:toggle'),
  system: () => ipcRenderer.invoke('dark-mode:system'),
});

contextBridge.exposeInMainWorld(
  'fileHandler',
  {
    getFileFromUser: (callback) =>
      ipcRenderer.on('getFile', (event, args) => {
        callback(args);
      }),
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

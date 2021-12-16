const { contextBridge, ipcRenderer, ipcMain } = require('electron');

contextBridge.exposeInMainWorld('darkMode', {
  toggle: () => ipcRenderer.invoke('dark-mode:toggle'),
  system: () => ipcRenderer.invoke('dark-mode:system'),
});

// contextBridge.exposeInMainWorld(
//   'storeHandler',
//   {
//     sentStoreValueToMain: (channel, value) =>
//       ipcRenderer.invoke('sentValue', value),
//     getStoreValueFromMain: (callback) =>
//       ipcRenderer.on('getValue', async function (event, value) {
//         // console.log("this is the message inside the ipcOn:", content);
//         await callback(value);
//       }),
//   },
//   false
// );

contextBridge.exposeInMainWorld(
  'fileHandler',
  {
    getFileFromUser: (event) => ipcRenderer.invoke('getFileFromUser'),
    recieveMessage: (callback) =>
      ipcRenderer.on(
        'eventFromMain',
        async function (event, content, allFiles) {
          // console.log("this is the message inside the ipcOn:", content);
          await callback(content, allFiles);
        }
      ),
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

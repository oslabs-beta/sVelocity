const { contextBridge, ipcRenderer } = require('electron');
const { remote } = require('electron');

contextBridge.exposeInMainWorld('darkMode', {
  toggle: () => ipcRenderer.invoke('dark-mode:toggle'),
  system: () => ipcRenderer.invoke('dark-mode:system'),
});

contextBridge.exposeInMainWorld(
  'browserView',
  {
    getInputUrl: (channel, browserURL) => ipcRenderer.invoke('getInputUrl', browserURL)
  },
)
contextBridge.exposeInMainWorld(
  'fileHandler',
  {
    getFileFromUser: (event) => ipcRenderer.invoke("getFileFromUser"),
    recieveMessage: (callback) => ipcRenderer.on("eventFromMain", async function (event, content) {
      // console.log("this is the message inside the ipcOn:", content);
      await callback(content);
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

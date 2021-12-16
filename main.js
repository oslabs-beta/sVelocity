const {
  app,
  BrowserWindow,
  BrowserView,
  ipcMain,
  nativeTheme,
  dialog,
} = require('electron');
const path = require('path');
const { promises: fs } = require('fs');
const Store = require('electron-store');
const store = new Store();

// instantiate browser view
store.set('allFiles', []);

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(app.getAppPath(), 'preload.js'),
    },
  });
  //set up broswer view
  win.loadFile('index.html');
  win.webContents.openDevTools();

  // const view = new BrowserView();
  // win.setBrowserView(view);
  // view.setBounds({ x: 500, y: 0, width: 300, height: 300 });
  // view.webContents.loadURL('https://github.com/oslabs-beta/sVelocity');
  // view.setAutoResize({ horizontal: true, vertical: true });
  // ipcMain.handle('dark-mode:toggle', () => {
  //   if (nativeTheme.shouldUseDarkColors) {
  //     nativeTheme.themeSource = 'light';
  //   } else {
  //     nativeTheme.themeSource = 'dark';
  //   }
  //   return nativeTheme.shouldUseDarkColors;
  // });

  ipcMain.handle('dark-mode:system', () => {
    nativeTheme.themeSource = 'system';
  });
};

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });

  app.on('window-all-closed', () => {
    app.quit();
  });
});

//codeblock which allows us to open files and read files
// ipcMain.handle('getFileFromUser', async () => {
//   try {
//     const files = await dialog.showOpenDialog({
//       properties: ['openFile'],
//       filters: [
//         { name: 'Markdown Files', extensions: ['md', 'mdown', 'markdown'] },
//         { name: 'Svelte Files', extensions: ['.svelte'] },
//         { name: 'Markup Files', extensions: ['.html'] },
//         { name: 'Javascript Files', extensions: ['.js'] },
//         { name: 'Style Files', extensions: ['.css'] },
//       ],
//     });
//     const file = files.filePaths[0];
//     if (!file) return;
//     const content = await fs.readFile(file, 'utf-8');
//     store.set('openedFile', content);
//     // console.log('open file in main', content);
//     console.log('file in store', store.get('openedFile'));
//   } catch (error) {
//     console.log('error', error);
//   }
// });
ipcMain.handle('getFileFromUser', async (event) => {
  try {
    const files = await dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [
        { name: 'Markdown Files', extensions: ['md', 'mdown', 'markdown'] },
        { name: 'Svelte Files', extensions: ['.svelte'] },
        { name: 'Markup Files', extensions: ['.html'] },
        { name: 'Javascript Files', extensions: ['.js'] },
        { name: 'Style Files', extensions: ['.css'] },
      ],
    });
    const file = files.filePaths[0];
    if (!file) return;
    const content = await fs.readFile(file, 'utf-8');

    allFiles = store.get('allFiles');
    allFiles.push(file);
    store.set('allFiles', allFiles);
    console.log(store.get('allFiles'));
    event.sender.send('eventFromMain', content, allFiles);


    // store.set('openedFile', content);
    // console.log('open file in main', content);
    // console.log('file in store', store.get('openedFile'));
  } catch (error) {
    console.log('error', error);
  }
});

// ipcMain.handle('getStoreValue', (event, key) => {
//   return store.get(key);
// });

ipcMain.handle('saveFile', (event, editorValue) => {
  const content = editorValue.toString();

  //console.log('editorValueMain2', editorValue);
  dialog
    .showSaveDialog({
      buttonLabel: 'Save Button(:',
      filters: [
        { name: 'Text Files', extensions: ['txt', 'docx'] },
        { name: 'Markdown Files', extensions: ['md', 'mdown', 'markdown'] },
        { name: 'Svelte Files', extensions: ['.svelte'] },
        { name: 'Markup Files', extensions: ['.html'] },
        { name: 'Javascript Files', extensions: ['.js'] },
        { name: 'Style Files', extensions: ['.css'] },
      ],
      properties: [],
    })
    .then(async (file) => {
      if (file === undefined) {
        console.log("You didn't save the file");
        return;
      } else {
        const saveFile = await fs.writeFile(file.filePath, content, (err) => {
          if (err) {
            alert('An error ocurred creating the file ' + err.message);
          }
          //store.set('saveFile', saveFile);
          alert('The file has been succesfully saved');
        });
      }

      // fileName is a string that contains the path and filename created in the save file dialog.
      // const data = file.filePaths[];
      // console.log('textArea____________', editor.getValue());
      // console.log(file);
    });
});

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

store.set('allFiles', []);

const filters = [
  { name: 'Text Files', extensions: ['txt', 'docx'] },
  { name: 'Markdown Files', extensions: ['md', 'mdown', 'markdown'] },
  { name: 'Svelte Files', extensions: ['.svelte'] },
  { name: 'Markup Files', extensions: ['.html'] },
  { name: 'Javascript Files', extensions: ['.js'] },
  { name: 'Style Files', extensions: ['.css'] },
];

const modes = {
  js: 'text/javascript',
  md: 'text/x-markdown',
  mdown: 'text/x-markdown',
  markdown: 'text/x-markdown',
  html: 'text/html',
  css: 'text/css',
};

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

  const view = new BrowserView();
  win.setBrowserView(view);
  // view.setBounds({ x: 500, y: 0, width: 300, height: 300 });
  // view.webContents.loadURL('https://github.com/oslabs-beta/sVelocity');
  // view.setAutoResize({ horizontal: true, vertical: true });
  ipcMain.handle('dark-mode:toggle', () => {
    if (nativeTheme.shouldUseDarkColors) {
      nativeTheme.themeSource = 'light';
    } else {
      nativeTheme.themeSource = 'dark';
    }
    return nativeTheme.shouldUseDarkColors;
  });

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

ipcMain.handle('getFileFromUser', async (event) => {
  try {
    const files = await dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [{ name: 'All Files', extensions: ['*'] }],
    });

    const file = files.filePaths[0];
    if (!file) return;

    const content = await fs.readFile(file, 'utf-8');
    allFiles = store.get('allFiles');

    if (
      allFiles.find((obj) => {
        return obj.filepath === file;
      })
    ) {
      return;
    }

    allFiles.push({
      filepath: file,
      filename: file.slice(file.lastIndexOf('/') + 1, file.length),
      active: false,
      editor: {
        theme: 'pastel-on-dark',
        mode: modes[file.slice(file.lastIndexOf('.') + 1, file.length)],
        lineNumbers: true,
        tabSize: 2,
        value: content,
      },
    });
    store.set('allFiles', allFiles);
    event.sender.send('eventFromMain', content, allFiles);
  } catch (error) {
    console.log('error', error);
  }
});

ipcMain.handle('saveFile', (event, editorValue) => {
  dialog
    .showSaveDialog({
      buttonLabel: 'Save Button(:',
      filters: filters,
      properties: [],
    })
    .then(async (file) => {
      try {
        if (file === undefined) {
          console.log("You didn't save the file");
          return;
        } else {
          await fs.writeFile(file.filePath, content, (err) => {
            if (err) {
              alert('An error ocurred creating the file ' + err.message);
            }
            alert('The file has been succesfully saved');
          });
        }
      } catch (error) {
        console.log('error', error);
      }
    });
});

ipcMain.handle('createFile', (event, fileName) => {
  fs.writeFile(`/Users/elenizoump/Desktop/${fileName}`, '', (err) => {
    if (err) {
      alert('An error ocurred creating the file ' + err.message);
    }
    alert('The file has been succesfully created');
  });
});

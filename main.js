const {
  app,
  BrowserWindow,
  ipcMain,
  nativeTheme,
  dialog,
} = require('electron');
const path = require('path');
const { promises: fs } = require('fs');
require('electron-reload')(__dirname, {
  // Note that the path to electron may vary according to the main file
  electron: require(`${__dirname}/node_modules/electron`),
});
const Store = require('electron-store');

const store = new Store();

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(app.getAppPath(), 'preload.js'),
    },
  });

  win.loadFile('index.html');
  win.webContents.openDevTools();

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

//codeblock which allows us to open files and read files
ipcMain.handle('getFileFromUser', async () => {
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
    store.set('openedFile', content);
    // console.log(store.get('openedFile'));
  } catch (error) {
    console.log('error', error);
  }
});
require('./src/index.js');

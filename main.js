const {
  app,
  BrowserWindow,
  BrowserView,
  ipcMain,
  nativeTheme,
  dialog,
  ipcRenderer,
} = require('electron');
const path = require('path');
const { promises: fs } = require('fs');
const Store = require('electron-store');
const store = new Store();
const exec = require('child_process');
const spawn = require('cross-spawn');

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(app.getAppPath(), 'preload.js'),
    },
  });
  //set up broswer view
  win.loadFile('index.html');

  win.webContents.openDevTools({mode: 'detach'});

  console.log("widthhhhhhhhh", win.getBounds())
  console.log("SIZE:", win.getSize())

  const view = new BrowserView();
  win.setBrowserView(view);
  view.setBounds({ x: 550, y: 68, width: 450, height: 480 });
  let url;
  if (!url) {
    view.webContents.loadURL('https://svelte.dev/docs');
  }

  ipcMain.handle('getInputUrl', async (event, browserURL) => {
    try {
      url = browserURL;
      view.webContents.loadURL(url);
    }
    catch (error) {
      view.webContents.loadURL('https://http.cat/404');
    }
  });

  view.webContents.on('did-fail-load', function () {
    console.log(`failed to load ${url}`);
    view.webContents.loadURL('https://http.cat/404');
  })
  view.setAutoResize({ horizontal: true })

  function devT() {
    // devtools = new BrowserWindow();
    // view.webContents.setDevToolsWebContents(view.webContents);
    view.webContents.openDevTools({ mode: 'right' });
    view.webContents.once('did-finish-load', function () {
      var windowBounds = view.getBounds();
      devtools.setPosition(windowBounds.x + windowBounds.width, windowBounds.y);
      devtools.setSize(windowBounds.width / 2, windowBounds.height);
    });
  }
    // win.on('move', function () {
    //   var windowBounds = win.getBounds();
    //   devtools.setPosition(windowBounds.x + windowBounds.width, windowBounds.y);
    //   devtools.on('closed', function (){
    //     devtools = null;
    //   })
    // });
  ipcMain.handle('openDevTools', () => {
    devT();
  });

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
    // win.closeDevTools();
    app.quit();
  });
});

ipcMain.handle("getFileFromUser", async (event) => {
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
    event.sender.send("eventFromMain", content);
  } catch (error) {
    console.log('error', error);
  }
});

ipcMain.handle('saveFile', (event, editorValue) => {
  const content = editorValue.toString();

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
          alert('The file has been succesfully saved');
        });
      }
    });
});

ipcMain.handle('runTerminal', (event, termCommand, args) => {
  if (termCommand == '' || args == '') {
    return;
  }
  console.log('arguments in main.js', termCommand + ' ' + args);

  const ls = spawn(termCommand, args, { "cwd": '/tmp' });

  ls.stdout.on('data', (data) => {
    data = data.toString().trim();
    event.sender.send('terminalOutput', data);
    console.log(`stdout: ${data}`);
  });

  ls.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  ls.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
  });
})
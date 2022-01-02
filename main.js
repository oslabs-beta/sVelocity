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
// const exec = require('child_process');
const spawn = require('cross-spawn');
const store = new Store();
// const { shellPath } = require('shell-path');
store.set('allFiles', []);
// const fixPath = require('fix-path');

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
    width: 1000,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      preload: path.resolve(app.getAppPath(), 'preload.js'),
    },
  });

  // win.loadFile('index.html');
  win.loadFile(path.resolve(__dirname, 'index.html'));

  win.webContents.openDevTools({ mode: 'detach' });

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
    } catch (error) {
      view.webContents.loadURL('https://http.cat/404');
    }
  });

  view.webContents.on('did-fail-load', function () {
    console.log(`failed to load ${url}`);
    view.webContents.loadURL('https://http.cat/404');
  });
  view.setAutoResize({ horizontal: true });

  function devT() {
    view.webContents.openDevTools({ mode: 'right' });
    view.webContents.once('did-finish-load', function () {
      var windowBounds = view.getBounds();
      devtools.setPosition(windowBounds.x + windowBounds.width, windowBounds.y);
      devtools.setSize(windowBounds.width / 2, windowBounds.height);
    });
  }

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
    app.quit();
  });
});

ipcMain.handle('getFileFromUser', async (event) => {
  try {
    const files = await dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [{ name: 'All Files', extensions: ['*'] }],
      //filters: filters,
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
  const content = editorValue.toString();

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
//   if (file === undefined) {
//     console.log("You didn't save the file");
//     return;
//   } else {
//     const saveFile = await fs.writeFile(file.filePath, content, (err) => {
//       if (err) {
//         alert('An error ocurred creating the file ' + err.message);
//       }
//       alert('The file has been succesfully saved');
//     });
//   }
// });
//});

ipcMain.handle('runTerminal', (event, termCommand, args = ['']) => {
  if (termCommand == '') {
    return;
  }

  console.log('arguments in main.js', termCommand + ' ' + args);
  // await shellPath();
  const ls = spawn('source $HOME/.zshrc;' + termCommand, args, {
    cwd: '/tmp',
    shell: true,
  });
  console.log('this is the terminal command from main.js', termCommand);
  console.log('these are arguments', args);
  console.log(process.env.PATH);
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
});

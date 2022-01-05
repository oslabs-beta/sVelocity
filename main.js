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
const spawn = require('cross-spawn');
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
    width: 1000,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      preload: path.resolve(app.getAppPath(), 'preload.js'),
    },
  });

  win.loadFile(path.resolve(__dirname, 'index.html'));

  // win.webContents.openDevTools({ mode: 'detach' });

  const view = new BrowserView();
  win.setBrowserView(view);
  view.setBounds({ x: 600, y: 50, width: 400, height: 800 });
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

  view.setAutoResize({ horizontal: true, vertical: true, height: true });

  function devT() {
    view.webContents.openDevTools({ mode: 'bottom' });
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

ipcMain.handle('saveFile', async (event, editorValue, fileName) => {
  try {
    const content = await editorValue.toString();
    //find file in store and file location in fs and update
    const allFiles = await store.get('allFiles');
    const file = allFiles.find((obj) => {
      return obj.filename === fileName;
    });
    await fs.writeFile(file.filepath, content, (err) => {
      if (err) {
        alert('An error ocurred creating the file ' + err.message);
      }
      alert('The file has been succesfully saved');
    });
  } catch (error) {
    console.log('error', error);
  }
});

ipcMain.handle('createFile', (event, fileName) => {
  try {
    //get the location where the new file will be created
    const newFilePath = `/Users/elenizoump/Desktop/${fileName}`;
    // const homePath = (function () {
    //   function homedir() {
    //     var env = process.env;
    //     var home = env.HOME;
    //     var user = env.LOGNAME || env.USER || env.LNAME || env.USERNAME;

    //     if (process.platform === 'win32') {
    //       return (
    //         env.USERPROFILE || env.HOMEDRIVE + env.HOMEPATH || home || null
    //       );
    //     }

    //     if (process.platform === 'darwin') {
    //       return home || (user ? '/Users/' + user : null);
    //     }

    //     if (process.platform === 'linux') {
    //       return (
    //         home ||
    //         (process.getuid() === 0 ? '/root' : user ? '/home/' + user : null)
    //       );
    //     }

    //     return home || null;
    //   }
    //   return typeof os.homedir === 'function' ? os.homedir : homedir;
    // })();

    //const newFilePath = homePath + `/Desktop/${fileName}`;

    //begin with the contents of a new editor
    fs.writeFile(newFilePath, '', (err) => {
      if (err) {
        alert('An error ocurred creating the file ' + err.message);
      }
      alert('The file has been succesfully created');
    });
    //create a new item in the store
    allFiles = store.get('allFiles');
    allFiles.push({
      filepath: newFilePath,
      filename: fileName,
      active: false,
      editor: {
        theme: 'pastel-on-dark',
        mode: modes[
          newFilePath.slice(
            newFilePath.lastIndexOf('.') + 1,
            newFilePath.length
          )
        ],
        lineNumbers: true,
        tabSize: 2,
        value: '',
      },
    });
    store.set('allFiles', allFiles);
    event.sender.send('eventInMain', allFiles);
  } catch (error) {
    console.log('error', error);
  }
});

ipcMain.handle('runTerminal', (event, termCommand, args = ['']) => {
  if (termCommand == '') {
    return;
  }

  console.log('arguments in main.js', termCommand + ' ' + args);
  const shellPath = '/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin';
  const ls = spawn(`export PATH=${shellPath};` + termCommand, args, {
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
    data = data.toString().trim();
    event.sender.send('terminalOutput', data);
    console.error(`stderr: ${data}`);
  });

  ls.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
  });
});

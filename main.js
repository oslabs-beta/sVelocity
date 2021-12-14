const {
  app,
  BrowserWindow,
  ipcMain,
  nativeTheme,
  dialog,
} = require("electron");
const path = require("path");
const { promises: fs } = require("fs");
// const editor = require("./src/index.js");

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(app.getAppPath(), "preload.js"),
    },
  });

  win.loadFile("index.html");
  win.webContents.openDevTools();

  ipcMain.handle("dark-mode:toggle", () => {
    if (nativeTheme.shouldUseDarkColors) {
      nativeTheme.themeSource = "light";
    } else {
      nativeTheme.themeSource = "dark";
    }
    return nativeTheme.shouldUseDarkColors;
  });

  ipcMain.handle("dark-mode:system", () => {
    nativeTheme.themeSource = "system";
  });
};

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });

  app.on("window-all-closed", () => {
    app.quit();
  });
});

//codeblock which allows us to open files and read files
ipcMain.handle("getFileFromUser", async () => {
  try {
    const files = await dialog.showOpenDialog({
      properties: ["openFile"],
      filters: [
        { name: "Markdown Files", extensions: ["md", "mdown", "markdown"] },
        { name: "Svelte Files", extensions: [".svelte"] },
        { name: "Markup Files", extensions: [".html"] },
        { name: "Javascript Files", extensions: [".js"] },
        { name: "Style Files", extensions: [".css"] },
      ],
    });
    const file = files.filePaths[0];
    if (!file) return;
    const content = await fs.readFile(file, "utf-8");
    console.log(content);
  } catch (error) {
    console.log("error", error); 
  }
});


ipcMain.handle("saveFile", () => {
  let content = "add content here...";
  dialog.showSaveDialog({
    buttonLabel: 'Save Button(:',
    filters: [
      {name: 'Text Files', extensions: ['txt', 'docx']},
      { name: "Markdown Files", extensions: ["md", "mdown", "markdown"] },
      { name: "Svelte Files", extensions: [".svelte"] },
      { name: "Markup Files", extensions: [".html"] },
      { name: "Javascript Files", extensions: [".js"] },
      { name: "Style Files", extensions: [".css"] },
    ],
    properties: []
  }).then(async (file) => {
    if (file === undefined) {
      console.log("You didn't save the file");
      return;
    }

    // fileName is a string that contains the path and filename created in the save file dialog.  
    // const data = file.filePaths[];

    console.log(file);
    const saveFile = await fs.writeFile(file.filePath, content, (err) => {
      if (err) {
        alert("An error ocurred creating the file " + err.message)
      }

      alert("The file has been succesfully saved");
    });
  })
})
const { app, BrowserWindow, ipcMain, Notification } = require('electron');
const path = require('path');
const fs = require('fs');

function createWindow () {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });

  mainWindow.loadFile('index.html');
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

const dataPath = path.join(app.getPath('userData'), 'highScore.json');

ipcMain.handle('save-score', (event, score) => {
  fs.writeFileSync(dataPath, JSON.stringify({ highScore: score }));
});

ipcMain.handle('load-score', () => {
  if (fs.existsSync(dataPath)) {
    const data = fs.readFileSync(dataPath, 'utf-8');
    return JSON.parse(data).highScore;
  }
  return 0;
});

ipcMain.on('show-notification', (event, title, body) => {
  new Notification({ title, body }).show();
});

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  saveScore: (score) => ipcRenderer.invoke('save-score', score),
  loadScore: () => ipcRenderer.invoke('load-score'),
  showNotification: (title, body) => ipcRenderer.send('show-notification', title, body)
});

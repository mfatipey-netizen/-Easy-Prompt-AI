const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  getConfig: () => ipcRenderer.invoke('config:get'),
  setConfig: (cfg) => ipcRenderer.invoke('config:set', cfg),
  onConfigUpdated: (cb) => ipcRenderer.on('config:updated', (_e, cfg) => cb(cfg)),
  setClickThrough: (on) => ipcRenderer.invoke('overlay:setClickThrough', on),
  moveOverlay: (dx, dy) => ipcRenderer.invoke('overlay:move', dx, dy),
  resizeOverlay: (dw, dh) => ipcRenderer.invoke('overlay:resize', dw, dh),
  hideOverlay: () => ipcRenderer.invoke('overlay:hide'),
  showOverlay: () => ipcRenderer.invoke('overlay:show'),
  openSettings: () => ipcRenderer.invoke('settings:open'),
  quit: () => ipcRenderer.invoke('app:quit'),
});

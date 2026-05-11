const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('superMenusDesktop', {
  platform: process.platform,
});

const { contextBridge, ipcRenderer } = require('electron')

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('api', {
  send: (channel, data) => {
    // whitelist channels
    let validChannels = ['getText']
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data)
    }
  },
  on: (channel, func) => {
    let validChannels = ['getText-replay']
    if (validChannels.includes(channel)) {
      // Deliberately strip event as it includes `sender`
      ipcRenderer.on(channel, (event, ...args) => func(...args))
    }
  },
  clear: (channel, func) => {
    let validChannels = ['getText-replay']
    if (validChannels.includes(channel)) {
      // Deliberately strip event as it includes `sender`
      console.log('clearing', channel)
      console.log('func', func)
      ipcRenderer.removeListener(channel, func)
    }
  },
  clearAll: () => ipcRenderer.removeAllListeners(),
})

const {
  app,
  protocol,
  BrowserWindow,
  session,
  ipcMain,
  dialog,
} = require('electron')
const {
  default: installExtension,
  REDUX_DEVTOOLS,
  REACT_DEVELOPER_TOOLS,
} = require('electron-devtools-installer')

const Protocol = require('./protocol')
const path = require('path')
const fs = require('fs')
const isDev = process.env.NODE_ENV === 'development'
const port = 40992 // Hardcoded; needs to match webpack.development.js and package.json
const selfHost = `http://localhost:${port}`

//////////////////////////////////////////////

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

async function createWindow() {
  // If you'd like to set up auto-updating for your app,
  // I'd recommend looking at https://github.com/iffy/electron-updater-example
  // to use the method most suitable for you.
  // eg. autoUpdater.checkForUpdatesAndNotify();

  if (!isDev) {
    // Needs to happen before creating/loading the browser window;
    // protocol is only used in prod
    protocol.registerBufferProtocol(
      Protocol.scheme,
      Protocol.requestHandler
    ) /* eng-disable PROTOCOL_HANDLER_JS_CHECK */
  }

  // Create the browser window.
  win = new BrowserWindow({
    width: 1008,
    minWidth: 1008,
    height: 675,
    minHeight: 675,
    backgroundColor: '#0F172A',
    title: 'Text Search',
    autoHideMenuBar: true,
    webPreferences: {
      devTools: true,
      nodeIntegration: false,
      nodeIntegrationInWorker: false,
      nodeIntegrationInSubFrames: false,
      contextIsolation: true,
      enableRemoteModule: false,

      preload: path.join(__dirname, 'preload.js'),
      /* eng-disable PRELOAD_JS_CHECK */
      disableBlinkFeatures: 'Auxclick',
    },
  })

  win.once('ready-to-show', () => {
    // win.show()
    ipcMain.on('selectDirectory', () => {
      dialog
        .showOpenDialog(win, {
          properties: ['openDirectory'],
        })
        .then((result) => {
          win.webContents.send('selectedDirectory', result)
        })
        .catch((err) => {
          console.log(err)
        })
    })

    ipcMain.on('show-error-message', (e, data) => {
      console.log(data)
      dialog.showErrorBox(data.title, data.message)
    })
  })

  // Load app
  if (isDev) {
    win.loadURL(selfHost)
  } else {
    win.loadURL(`${Protocol.scheme}://rse/index.html`)
  }

  // Only do these things when in development
  if (isDev) {
    // Errors are thrown if the dev tools are opened
    // before the DOM is ready
    win.webContents.once('dom-ready', async () => {
      await installExtension([REDUX_DEVTOOLS, REACT_DEVELOPER_TOOLS])
        .then((name) => console.log(`Added Extension: ${name}`))
        .catch((err) => console.log('An error occurred: ', err))
        .finally(() => {
          require('electron-debug')() // https://github.com/sindresorhus/electron-debug
          win.webContents.openDevTools()
        })
    })
  }

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })

  // https://electronjs.org/docs/tutorial/security#4-handle-session-permission-requests-from-remote-content
  const ses = session
  const partition = 'default'
  ses
    .fromPartition(
      partition
    ) /* eng-disable PERMISSION_REQUEST_HANDLER_JS_CHECK */
    .setPermissionRequestHandler((webContents, permission, permCallback) => {
      const allowedPermissions = [] // Full list here: https://developer.chrome.com/extensions/declare_permissions#manifest

      if (allowedPermissions.includes(permission)) {
        permCallback(true) // Approve permission request
      } else {
        console.error(
          `The application tried to request permission for '${permission}'. This permission was not whitelisted and has been blocked.`
        )

        permCallback(false) // Deny
      }
    })
}

// Needs to be called before app is ready;
// gives our scheme access to load relative files,
// as well as local storage, cookies, etc.
// https://electronjs.org/docs/api/protocol#protocolregisterschemesasprivilegedcustomschemes
protocol.registerSchemesAsPrivileged([
  {
    scheme: Protocol.scheme,
    privileges: {
      standard: true,
      secure: true,
    },
  },
])

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  // if (process.platform !== 'darwin') {
  // }
  app.quit()
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// https://electronjs.org/docs/tutorial/security#12-disable-or-limit-navigation
app.on('web-contents-created', (event, contents) => {
  contents.on('will-navigate', (contentsEvent, navigationUrl) => {
    /* eng-disable LIMIT_NAVIGATION_JS_CHECK  */
    const parsedUrl = new URL(navigationUrl)
    const validOrigins = [selfHost]

    // Log and prevent the app from navigating to a new page if that page's origin is not whitelisted
    if (!validOrigins.includes(parsedUrl.origin)) {
      console.error(
        `The application tried to navigate to the following address: '${parsedUrl}'. This origin is not whitelisted and the attempt to navigate was blocked.`
      )

      contentsEvent.preventDefault()
    }
  })

  contents.on('will-redirect', (contentsEvent, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl)
    const validOrigins = []

    // Log and prevent the app from redirecting to a new page
    if (!validOrigins.includes(parsedUrl.origin)) {
      console.error(
        `The application tried to redirect to the following address: '${navigationUrl}'. This attempt was blocked.`
      )

      contentsEvent.preventDefault()
    }
  })

  // https://electronjs.org/docs/tutorial/security#11-verify-webview-options-before-creation
  contents.on(
    'will-attach-webview',
    (contentsEvent, webPreferences, params) => {
      // Strip away preload scripts if unused or verify their location is legitimate
      delete webPreferences.preload
      delete webPreferences.preloadURL

      // Disable Node.js integration
      webPreferences.nodeIntegration = false
    }
  )

  // https://electronjs.org/docs/tutorial/security#13-disable-or-limit-creation-of-new-windows
  // This code replaces the old "new-window" event handling;
  // https://github.com/electron/electron/pull/24517#issue-447670981
  contents.setWindowOpenHandler(({ url }) => {
    const parsedUrl = new URL(url)
    const validOrigins = []

    // Log and prevent opening up a new window
    if (!validOrigins.includes(parsedUrl.origin)) {
      console.error(
        `The application tried to open a new window at the following address: '${url}'. This attempt was blocked.`
      )

      return {
        action: 'deny',
      }
    }

    return {
      action: 'allow',
    }
  })
})

////////////////////

let reader = require('any-text')

ipcMain.on('getText', async (e, files) => {
  let data = []
  try {
    for (i = 0; i < files.length; i++) {
      console.log(files[i].path)
      const text = await reader.getText(files[i].path)
      data.push({ file: files[i].path, text })
    }

    e.sender.send('getText-replay', undefined, data)
  } catch (err) {
    e.sender.send('getText-replay', err, data)
  }
})

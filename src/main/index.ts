import { app, shell, BrowserWindow, ipcMain } from 'electron'
import path, { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

import { isConnectedToInternet } from '@shared/helper/check_connection'
import { startExpress } from '@server/index'
import { getMode, switchToOffline, tryConnectMySQL } from '@server/database/conn'

let expressServer: ReturnType<typeof startExpress> | null = null
let intervalId: NodeJS.Timeout | null = null

function createWindow(): void {
  if (!expressServer) {
    expressServer = startExpress()
    startAutoSwitchInterval()
  }
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    show: false,
    icon: path.join(__dirname, '../../resources/icon.png'),
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

async function checkConnection(): Promise<void> {
  const online = await isConnectedToInternet()

  if (online) {
    console.log('[CHECK] Internet connected. Trying MySQL...')
    await tryConnectMySQL()
  } else {
    console.log('[CHECK] No internet. Switching to OFFLINE...')
    await switchToOffline()
  }

  console.log(`[MODE] Current mode: ${getMode()}`)
}

function startAutoSwitchInterval(): void {
  console.log('[INIT] Starting auto network check interval...')
  checkConnection()

  intervalId = setInterval(async () => {
    await checkConnection()
  }, 5000)
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', async () => {
  if (intervalId) clearInterval(intervalId)
  if (expressServer) {
    if (expressServer) {
      const server = await expressServer
      server.close()
    }
  }
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

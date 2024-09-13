import path from 'node:path'
import process from 'node:process'
import { app, BrowserWindow, ipcMain } from 'electron'
import { scanNetwork } from './net'
import { connectClient } from './sftp/client'
import { createServer } from './sftp/server'
import 'reflect-metadata'

process.env.DIST = path.join(__dirname, '../dist')
process.env.VITE_PUBLIC = app.isPackaged
  ? process.env.DIST
  : path.join(process.env.DIST, '../public')

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

let win: BrowserWindow | null

async function createWindow(): Promise<void> {
  await createServer()
  ipcMain.on('connect-client', async () => {
    await connectClient()
  })
  ipcMain.on('scan-network', async () => {
    await scanNetwork()
  })

  // const userController = new UserController();
  // await userController.save({ id: 7, firstName: 'John Doe2', age: 12 });

  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, 'logo.svg'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  })

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date()).toLocaleString())
  })

  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL)
    win.webContents.openDevTools()
  }
  else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(process.env.DIST, 'index.html'))
  }
}

app.on('window-all-closed', () => {
  app.quit()
  win = null
})

app.whenReady().then(createWindow)

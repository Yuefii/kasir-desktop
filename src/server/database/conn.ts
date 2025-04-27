import { syncAllModels } from '../model/init_model'
import mysql from './mysql'
import sqlite from './sqlite'

let mode = 'offline'
let sequelize = sqlite

export async function getSequelize() {
  return sequelize
}

export function getMode() {
  return mode
}

export async function tryConnectMySQL() {
  try {
    await mysql.authenticate()
    sequelize = mysql
    mode = 'online'
    console.log('[MODE SWITCH] Switched to ONLINE (MySQL)')
    await syncAllModels()
  } catch (err) {
    console.log('[MODE CHECK] MySQL not available. Staying in OFFLINE mode.')
    await switchToOffline()
  }
}

export async function switchToOffline() {
  try {
    await sqlite.authenticate()
    sequelize = sqlite
    mode = 'offline'
    console.log('[MODE SWITCH] Switched to OFFLINE (SQLite)')
    await syncAllModels()
  } catch (err) {
    console.error('Failed to connect to SQLite:', err)
  }
}

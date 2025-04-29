import mysql from '../../database/mysql'
import sqlite from '../../database/sqlite'
import { InventoriModelFactory } from '../factory/inventori_factory.model'

export async function getInventoriModels() {
  let sqliteInventori = sqlite.models.inventori
  let mysqlInventori = mysql.models?.inventori

  if (!sqliteInventori) {
    console.log('[MODEL INIT] Defining SQLite inventori model...')
    sqliteInventori = (await InventoriModelFactory()).Inventori
  }

  if (!mysqlInventori && mysql) {
    console.log('[MODEL INIT] Defining MySQL inventori model...')
    mysqlInventori = mysql.models?.inventori ?? (await InventoriModelFactory()).Inventori
  }

  return {
    sqlite: sqliteInventori,
    mysql: mysqlInventori
  }
}

import mysql from '../../database/mysql'
import sqlite from '../../database/sqlite'
import { CabangModelFactory } from '../factory/cabang_factory.model'

export async function getCabangModels() {
  let sqliteCabang = sqlite.models.cabang
  let mysqlCabang = mysql.models?.cabang

  if (!sqliteCabang) {
    console.log('[MODEL INIT] Defining SQLite cabang model...')
    sqliteCabang = await CabangModelFactory()
  }

  if (!mysqlCabang && mysql) {
    console.log('[MODEL INIT] Defining MySQL cabang model...')
    mysqlCabang = mysql.models?.cabang ?? (await CabangModelFactory())
  }

  return {
    sqlite: sqliteCabang,
    mysql: mysqlCabang
  }
}

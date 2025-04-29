import mysql from '../../database/mysql'
import sqlite from '../../database/sqlite'
import { KategoriModelFactory } from '../factory/kategori_factory.model'

export async function getKategoriModels() {
  let sqliteKategori = sqlite.models.kategori
  let mysqlKategori = mysql.models?.kategori

  if (!sqliteKategori) {
    console.log('[MODEL INIT] Defining SQLite kategori model...')
    sqliteKategori = await KategoriModelFactory()
  }

  if (!mysqlKategori && mysql) {
    console.log('[MODEL INIT] Defining MySQL kategori model...')
    mysqlKategori = mysql.models?.kategori ?? (await KategoriModelFactory())
  }

  return {
    sqlite: sqliteKategori,
    mysql: mysqlKategori
  }
}

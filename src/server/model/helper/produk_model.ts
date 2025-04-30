import mysql from '../../database/mysql'
import sqlite from '../../database/sqlite'
import { ProdukModelFactory } from '../factory/produk_factory.model'

export async function getProdukModels() {
  let sqliteProduk = sqlite.models.produk
  let mysqlProduk = mysql.models?.produk

  if (!sqliteProduk) {
    console.log('[MODEL INIT] Defining SQLite produk model...')
    sqliteProduk = (await ProdukModelFactory()).Produk
  }

  if (!mysqlProduk && mysql) {
    console.log('[MODEL INIT] Defining MySQL produk model...')
    mysqlProduk = mysql.models?.produk ?? (await ProdukModelFactory()).Produk
  }

  return {
    sqlite: sqliteProduk,
    mysql: mysqlProduk
  }
}

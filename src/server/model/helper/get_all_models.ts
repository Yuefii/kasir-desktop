import mysql from '../../database/mysql'
import sqlite from '../../database/sqlite'
import { defineCabang } from '../define/define_cabang'
import { defineHargaProduk } from '../define/define_harga_produk'
import { defineInventori } from '../define/define_inventori'
import { defineKategori } from '../define/define_kategori'
import { definePegawai } from '../define/define_pegawai'
import { defineProduk } from '../define/define_produk'
import { defineSupplier } from '../define/define_supplier'

let cachedSQLiteModels: any = null
let cachedMySQLModels: any = null

export async function getAllModels() {
  if (!cachedSQLiteModels) {
    cachedSQLiteModels = {
      cabang: defineCabang(sqlite),
      kategori: defineKategori(sqlite),
      produk: defineProduk(sqlite),
      harga_produk: defineHargaProduk(sqlite),
      inventori: defineInventori(sqlite),
      supplier: defineSupplier(sqlite),
      pegawai: definePegawai(sqlite)
    }
  }

  if (!cachedMySQLModels) {
    cachedMySQLModels = {
      cabang: defineCabang(mysql),
      kategori: defineKategori(mysql),
      produk: defineProduk(mysql),
      harga_produk: defineHargaProduk(mysql),
      inventori: defineInventori(mysql),
      supplier: defineSupplier(mysql),
      pegawai: definePegawai(mysql)
    }
  }

  return {
    sqliteModels: cachedSQLiteModels,
    mysqlModels: cachedMySQLModels
  }
}

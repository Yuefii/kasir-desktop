import mysql from '../../database/mysql'
import sqlite from '../../database/sqlite'

import { defineCabang } from '../define/define_cabang'
import { defineHargaProduk } from '../define/define_harga_produk'
import { defineInventori } from '../define/define_inventori'
import { defineKategori } from '../define/define_kategori'
import { definePegawai } from '../define/define_pegawai'
import { definePembelian } from '../define/define_pembelian'
import { definePembelianItem } from '../define/define_pembelian_item'
import { defineProduk } from '../define/define_produk'
import { defineSupplier } from '../define/define_supplier'

type SQLiteModels = {
  cabang: ReturnType<typeof defineCabang>
  kategori: ReturnType<typeof defineKategori>
  produk: ReturnType<typeof defineProduk>
  harga_produk: ReturnType<typeof defineHargaProduk>
  inventori: ReturnType<typeof defineInventori>
  supplier: ReturnType<typeof defineSupplier>
  pegawai: ReturnType<typeof definePegawai>
  pembelian: ReturnType<typeof definePembelian>
  pembelian_item: ReturnType<typeof definePembelianItem>
}

type AllModels = {
  sqliteModels: SQLiteModels
  mysqlModels: SQLiteModels
}

let cachedSQLiteModels: SQLiteModels | null = null
let cachedMySQLModels: SQLiteModels | null = null

export async function getAllModels(): Promise<AllModels> {
  if (!cachedSQLiteModels) {
    cachedSQLiteModels = {
      cabang: defineCabang(sqlite),
      kategori: defineKategori(sqlite),
      produk: defineProduk(sqlite),
      harga_produk: defineHargaProduk(sqlite),
      inventori: defineInventori(sqlite),
      supplier: defineSupplier(sqlite),
      pegawai: definePegawai(sqlite),
      pembelian: definePembelian(sqlite),
      pembelian_item: definePembelianItem(sqlite)
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
      pegawai: definePegawai(mysql),
      pembelian: definePembelian(mysql),
      pembelian_item: definePembelianItem(mysql)
    }
  }

  return {
    sqliteModels: cachedSQLiteModels,
    mysqlModels: cachedMySQLModels
  }
}

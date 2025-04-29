import sqlite from '../../database/sqlite'
import mysql from '../../database/mysql'
import { defineCabangModel } from '../cabang'
import { defineKategoriModel } from '../kategori'
import { defineProdukModel } from '../produk'
import { defineInventoriModel } from '../inventori'

export async function getAllModels() {
  const sqliteModels = {
    cabang: await defineCabangModel(sqlite),
    kategori: await defineKategoriModel(sqlite),
    produk: await defineProdukModel(sqlite),
    inventori: await defineInventoriModel(sqlite)
  }

  const mysqlModels = {
    cabang: await defineCabangModel(mysql),
    kategori: await defineKategoriModel(mysql),
    produk: await defineProdukModel(mysql),
    inventori: await defineInventoriModel(mysql)
  }

  return {
    sqliteModels,
    mysqlModels
  }
}

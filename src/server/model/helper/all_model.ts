import sqlite from '../../database/sqlite'
import mysql from '../../database/mysql'
import { defineCabangModel } from '../cabang'
import { defineKategoriModel } from '../kategori'
import { defineProdukModel } from '../produk'

export async function getAllModels() {
  const sqliteModels = {
    cabang: await defineCabangModel(sqlite),
    kategori: await defineKategoriModel(sqlite),
    produk: await defineProdukModel(sqlite)
  }

  const mysqlModels = {
    cabang: await defineCabangModel(mysql),
    kategori: await defineKategoriModel(mysql),
    produk: await defineProdukModel(mysql)
  }

  return {
    sqliteModels,
    mysqlModels
  }
}

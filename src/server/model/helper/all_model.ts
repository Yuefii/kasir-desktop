import sqlite from '../../database/sqlite'
import mysql from '../../database/mysql'
import { defineCabangModel } from '../entitas/cabang'
import { defineKategoriModel } from '../entitas/kategori'
import { defineProdukModel } from '../entitas/produk'
import { defineInventoriModel } from '../entitas/inventori'
import { defineSupplierModel } from '../entitas/supplier'

export async function getAllModels() {
  const sqliteModels = {
    cabang: await defineCabangModel(sqlite),
    kategori: await defineKategoriModel(sqlite),
    produk: await defineProdukModel(sqlite),
    inventori: await defineInventoriModel(sqlite),
    supplier: await defineSupplierModel(sqlite)
  }

  const mysqlModels = {
    cabang: await defineCabangModel(mysql),
    kategori: await defineKategoriModel(mysql),
    produk: await defineProdukModel(mysql),
    inventori: await defineInventoriModel(mysql),
    supplier: await defineSupplierModel(mysql)
  }

  return {
    sqliteModels,
    mysqlModels
  }
}

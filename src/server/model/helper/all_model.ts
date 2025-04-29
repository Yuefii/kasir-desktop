import sqlite from '../../database/sqlite'
import mysql from '../../database/mysql'
import { defineCabangModel } from '../cabang'
import { defineKategoriModel } from '../kategori'

export async function getAllModels() {
  const sqliteModels = {
    cabang: await defineCabangModel(sqlite),
    kategori: await defineKategoriModel(sqlite)
  }

  const mysqlModels = {
    cabang: await defineCabangModel(mysql),
    kategori: await defineKategoriModel(mysql)
  }

  return {
    sqliteModels,
    mysqlModels
  }
}

import sqlite from '../../database/sqlite'
import mysql from '../../database/mysql'
import { defineCabangModel } from '../cabang'

export async function getAllModels() {
  const sqliteModels = {
    cabang: await defineCabangModel(sqlite)
  }

  const mysqlModels = {
    cabang: await defineCabangModel(mysql)
  }

  return {
    sqliteModels,
    mysqlModels
  }
}

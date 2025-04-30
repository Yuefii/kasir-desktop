import mysql from '../../database/mysql'
import sqlite from '../../database/sqlite'
import { SupplierModelFactory } from '../factory/supplier_factory.model'

export async function getSupplierModels() {
  let sqliteSupplier = sqlite.models.supplier
  let mysqlSupplier = mysql.models?.supplier

  if (!sqliteSupplier) {
    console.log('[MODEL INIT] Defining SQLite supplier model...')
    sqliteSupplier = await SupplierModelFactory()
  }

  if (!mysqlSupplier && mysql) {
    console.log('[MODEL INIT] Defining MySQL supplier model...')
    mysqlSupplier = mysql.models?.supplier ?? (await SupplierModelFactory())
  }

  return {
    sqlite: sqliteSupplier,
    mysql: mysqlSupplier
  }
}

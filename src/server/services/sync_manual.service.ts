import { getMode } from '../database/conn'
import { getAllModels } from '../model/helper/all_model'

export async function manualSyncAllTables() {
  const mode = getMode()

  if (mode === 'offline') {
    throw new Error('Tidak dapat sinkronisasi saat mode OFFLINE.')
  }

  const { sqliteModels, mysqlModels } = await getAllModels()
  const results: Record<string, number> = {}

  for (const tableName of Object.keys(sqliteModels)) {
    const sqliteModel = await sqliteModels[tableName]
    const mysqlModel = await mysqlModels[tableName]

    if (!sqliteModel.rawAttributes?.isSynced) continue

    const unsyncedRows = await sqliteModel.findAll({
      where: { isSynced: false },
      raw: true
    })

    let successCount = 0

    for (const row of unsyncedRows) {
      const { id, ...data } = row

      try {
        await mysqlModel.create({ ...data, isSynced: true })

        await sqliteModel.update({ isSynced: true }, { where: { id } })

        successCount++
      } catch (err) {
        console.error(`[SYNC ERROR] Table ${tableName}, ID ${id}`, err)
      }
    }

    results[tableName] = successCount
  }

  return results
}

import { getAllModels } from '../model/helper/all_model'

export async function getSyncStatus() {
  const { sqliteModels } = await getAllModels()

  const tableStatus: Record<string, number> = {}

  let totalUnsynced = 0

  for (const [tableName, model] of Object.entries(sqliteModels)) {
    if (!model.rawAttributes?.isSynced) continue

    const count = await model.count({
      where: { isSynced: false }
    })

    tableStatus[tableName] = count
    totalUnsynced += count
  }

  return {
    status: totalUnsynced === 0 ? 'synced' : 'unsynced',
    tables: tableStatus
  }
}

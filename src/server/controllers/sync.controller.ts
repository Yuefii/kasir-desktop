import { Request, Response } from 'express'
import { getMode } from '../database/conn'
import { getAllModels } from '../model/helper/get_all_models'

export class SyncController {
  static async SyncStatus(_req: Request, res: Response): Promise<void> {
    try {
      const { sqliteModels } = await getAllModels()
      const tableStatus: Record<string, number> = {}
      let totalUnsynced = 0

      for (const [tableName, model] of Object.entries(sqliteModels)) {
        if (!(model as any).rawAttributes?.isSynced) continue

        const count = await (model as any).count({
          where: {
            isSynced: false
          }
        })

        tableStatus[tableName] = count
        totalUnsynced += count
      }

      const status = totalUnsynced === 0 ? 'sinkron' : 'tidak sinkron'

      res.status(200).json({
        status,
        table: tableStatus
      })
    } catch (error) {
      console.error('error checking sinkronisasi status:', error)
      res.status(500).json({ error: 'internal server error' })
    }
  }

  static async SyncManual(_req: Request, res: Response): Promise<void> {
    try {
      const mode = getMode()

      if (mode === 'offline') {
        res.status(400).json({ error: 'Tidak dapat sinkronisasi saat mode OFFLINE.' })
      }

      const { sqliteModels, mysqlModels } = await getAllModels()
      const results: Record<string, number> = {}

      for (const tableName of Object.keys(sqliteModels)) {
        const sqliteModel = sqliteModels[tableName]
        const mysqlModel = mysqlModels[tableName]

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

      res.json(results)
    } catch (error) {
      console.error('error sinkronisasi manual:', error)
      res.status(500).json({ error: 'internal server error' })
    }
  }
}

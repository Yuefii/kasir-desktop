import { CabangInstance, CabangInterface } from '../model/cabang'
import { Request, Response } from 'express'
import { getCabangModels } from '../model/helper/cabang_model'
import { getMode } from '../database/conn'
import { CabangModelFactory } from '../model/factory/cabang_factory.model'

export class CabangController {
  static async getAll(_req: Request, res: Response) {
    try {
      const Cabang = await CabangModelFactory()
      const data = await Cabang.findAll()
      res.status(200).json({ data: data })
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error', error })
    }
  }

  static async create(req: Request, res: Response) {
    const request: CabangInterface = req.body
    request.is_aktif = true
    request.created_at = new Date()
    request.isSynced = false

    try {
      const { mysql, sqlite } = await getCabangModels()
      const mode = getMode()
      const sqliteData = (await sqlite.create(request as any)) as CabangInstance

      let mysqlData: CabangInstance | null = null

      if (mode === 'online' && mysql) {
        try {
          const mysqlRequest = { ...request, isSynced: true }
          mysqlData = (await mysql.create(mysqlRequest)) as CabangInstance
          await sqlite.update(
            { isSynced: true },
            { where: { id: (sqliteData as CabangInstance).id } }
          )
        } catch (mysqlErr) {
          console.error('[MySQL ERROR] Gagal insert ke MySQL:', mysqlErr)
        }
      }
      res.status(201).json({
        message: 'Cabang berhasil dibuat.',
        data: {
          savedToSQLite: sqliteData,
          savedToMySQL: mysqlData
        }
      })
    } catch (error) {
      console.error('[CREATE ERROR]', error)
      res.status(500).json({ message: 'Internal Server Error', error })
    }
  }
}

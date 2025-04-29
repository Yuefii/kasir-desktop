import { Request, Response } from 'express'
import { InventoriModelFactory } from '../model/factory/inventori_factory.model'
import { InventoriInstance, InventoriInterface } from '../model/inventori'
import { getInventoriModels } from '../model/helper/inventori_model'
import { getMode } from '../database/conn'

export class InventoriController {
  static async getAll(req: Request, res: Response) {
    try {
      const Inventori = await InventoriModelFactory()

      const halaman = parseInt(req.query.halaman as string) || 1
      const limit = parseInt(req.query.limit as string) || 5
      const offset = (halaman - 1) * limit

      const { count, rows } = await Inventori.Inventori.findAndCountAll({
        limit,
        offset,
        attributes: {
          exclude: ['id_produk', 'id_cabang']
        },
        include: [
          {
            association: 'cabang',
            attributes: ['id', 'nama']
          },
          {
            association: 'produk',
            attributes: ['id', 'nama']
          }
        ]
      })
      res.status(200).json({
        pagination: {
          total_data: count,
          halaman_sekarang: halaman,
          data_per_halaman: limit,
          total_halaman: Math.ceil(count / limit)
        },
        data: rows
      })
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error', error })
    }
  }

  static async create(req: Request, res: Response) {
    const request: InventoriInterface = req.body
    request.created_at = new Date()
    request.updated_at = new Date()
    request.isSynced = false

    if (!request.id_produk || !request.id_cabang) {
      res.status(400).json({ message: 'id_produk dan id_cabang harus diisi' })
    }

    try {
      const { mysql, sqlite } = await getInventoriModels()
      const mode = getMode()
      const sqliteCreated = (await sqlite.create(request as any)) as InventoriInstance

      const sqliteData = await sqlite.findOne({
        where: { id: sqliteCreated.id },
        include: [
          {
            association: 'cabang',
            attributes: ['id', 'kode_cabang', 'nama']
          },
          {
            association: 'produk',
            attributes: ['id', 'kode_produk', 'nama']
          }
        ]
      })

      let mysqlData: InventoriInstance | null = null

      if (mode === 'online' && mysql) {
        try {
          const mysqlRequest = { ...request, isSynced: true }
          const mysqlCreated = (await mysql.create(mysqlRequest)) as InventoriInstance
          await sqlite.update(
            { isSynced: true },
            { where: { id: (sqliteCreated as InventoriInstance).id } }
          )
          mysqlData = (await mysql.findOne({
            where: { id: mysqlCreated.id },
            include: [
              {
                association: 'cabang',
                attributes: ['id', 'kode_cabang', 'nama']
              },
              {
                association: 'produk',
                attributes: ['id', 'kode_produk', 'nama']
              }
            ]
          })) as InventoriInstance
        } catch (mysqlErr) {
          console.error('[MySQL ERROR] Gagal insert ke MySQL:', mysqlErr)
        }
      }
      res.status(201).json({
        message: 'Inventori berhasil dibuat.',
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

  static async update(req: Request, res: Response) {
    const { id } = req.params
    const request: Partial<InventoriInterface> = req.body
    request.updated_at = new Date()

    try {
      const { mysql, sqlite } = await getInventoriModels()
      const mode = getMode()
      const [sqliteUpdated] = await sqlite.update(request, {
        where: { id }
      })

      let mysqlUpdated: InventoriInstance | null = null
      if (mode === 'online' && mysql) {
        try {
          const [affectedCount] = await mysql.update(
            { ...request, isSynced: true },
            { where: { id } }
          )
          mysqlUpdated =
            affectedCount > 0 ? ((await mysql.findByPk(id)) as InventoriInstance | null) : null
        } catch (error) {
          console.error('[MYSQL ERROR] gagal untuk update ke mysql:', error)
        }
      }

      if (sqliteUpdated === 0) {
        res.status(404).json({ message: 'inventori tidak ditemukan' })
      }

      res.status(200).json({
        message: 'Inventori berhasil diupdate',
        updated_in_mysql: mysqlUpdated,
        update_in_sqlite: sqliteUpdated
      })
    } catch (error) {
      console.error('[UPDATE ERROR]', error)
      res.status(500).json({ messagae: 'internal server error', error })
    }
  }

  static async delete(req: Request, res: Response) {
    const { id } = req.params

    try {
      const { mysql, sqlite } = await getInventoriModels()
      const mode = getMode()

      const sqliteDeleted = await sqlite.destroy({ where: { id } })

      let mysqlDeleted: number = 0

      if (mode === 'online' && mysql) {
        try {
          mysqlDeleted = await mysql.destroy({ where: { id } })
        } catch (error) {
          console.error('[MYSQL ERROR] gagal menghapus data dari mysql:', error)
        }
      }

      if (sqliteDeleted === 0) {
        res.status(400).json({ message: 'inventori tidak ditemukan' })
      }

      res.status(200).json({
        message: 'inventori berhasil dihapus (hard delete)',
        deleted_from_mysql: mysqlDeleted,
        deleted_from_sqlite: sqliteDeleted
      })
    } catch (error) {
      console.error('[HARD DELETE ERROR]', error)
      res.status(500).json({ message: 'internal server error', error })
    }
  }
}

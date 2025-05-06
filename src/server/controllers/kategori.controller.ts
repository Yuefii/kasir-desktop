import { Model } from 'sequelize'
import { models } from '../model'
import { getMode } from '../database/conn'
import { Request, Response } from 'express'
import { KategoriInterface } from '../dto/kategori'

export class KategoriController {
  static async getAll(req: Request, res: Response) {
    try {
      const Kategori = models.Kategori
      const paginationQuery = req.query.pagination
      const isPaginationDisabled = paginationQuery === 'false'

      let data: Model[]
      let count: number

      if (isPaginationDisabled) {
        data = await Kategori.findAll()
        count = data.length
      } else {
        const halaman = parseInt(req.query.halaman as string) || 1
        const limit = parseInt(req.query.limit as string) || 5
        const offset = (halaman - 1) * limit

        const result = await Kategori.findAndCountAll({
          limit,
          offset
        })

        data = result.rows
        count = result.count
        res.status(200).json({
          pagination: {
            total_data: count,
            halaman_sekarang: halaman,
            data_per_halaman: limit,
            total_halaman: Math.ceil(count / limit)
          },
          data
        })
      }

      res.status(200).json({
        pagination: false,
        data
      })
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error', error })
    }
  }

  static async create(req: Request, res: Response) {
    const request: KategoriInterface = req.body
    request.created_at = new Date()
    request.isSynced = false

    try {
      const sqlite = models.Kategori
      const mysql = getMode() === 'online' ? models.Kategori : null

      const sqliteData = await sqlite.create(request)

      let mysqlData = null

      if (mysql) {
        try {
          const mysqlRequest = { ...request, isSynced: true }
          mysqlData = await mysql.create(mysqlRequest)
          await sqlite.update({ isSynced: true }, { where: { id: sqliteData.id } })
        } catch (mysqlErr) {
          console.error('[MySQL ERROR] Gagal insert ke MySQL:', mysqlErr)
        }
      }
      res.status(201).json({
        message: 'Kategori berhasil dibuat.',
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
    const request: Partial<KategoriInterface> = req.body

    try {
      const sqlite = models.Kategori
      const mysql = getMode() === 'online' ? models.Kategori : null
      const [sqliteUpdated] = await sqlite.update(request, {
        where: { id }
      })

      let mysqlUpdated = null
      if (mysql) {
        try {
          const [affectedCount] = await mysql.update(
            { ...request, isSynced: true },
            { where: { id } }
          )
          mysqlUpdated = affectedCount > 0 ? await mysql.findByPk(id) : null
        } catch (error) {
          console.error('[MYSQL ERROR] gagal untuk update ke mysql:', error)
        }
      }

      if (sqliteUpdated === 0) {
        res.status(404).json({ message: 'Kategori tidak ditemukan' })
      }

      res.status(200).json({
        message: 'Kategori berhasil diupdate',
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
      const sqlite = models.Kategori
      const mysql = getMode() === 'online' ? models.Kategori : null

      const sqliteDeleted = await sqlite.destroy({ where: { id } })

      let mysqlDeleted: number = 0

      if (mysql) {
        try {
          mysqlDeleted = await mysql.destroy({ where: { id } })
        } catch (error) {
          console.error('[MYSQL ERROR] gagal menghapus data dari mysql:', error)
        }
      }

      if (sqliteDeleted === 0) {
        res.status(400).json({ message: 'kategori tidak ditemukan' })
      }

      res.status(200).json({
        message: 'kategori berhasil dihapus (hard delete)',
        deleted_from_mysql: mysqlDeleted,
        deleted_from_sqlite: sqliteDeleted
      })
    } catch (error) {
      console.error('[SOFT DELETE ERROR]', error)
      res.status(500).json({ message: 'internal server error', error })
    }
  }
}

import { Request, Response } from 'express'
import { getMode } from '../database/conn'
import { models } from '../model'
import { SupplierInterface } from '../dto/supplier'

export class SupplierController {
  static async getAll(req: Request, res: Response) {
    try {
      const Supplier = models.Supplier

      const halaman = parseInt(req.query.halaman as string) || 1
      const limit = parseInt(req.query.limit as string) || 5
      const offset = (halaman - 1) * limit

      const { count, rows } = await Supplier.findAndCountAll({
        limit,
        offset
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
    const request: SupplierInterface = req.body
    request.created_at = new Date()
    request.updated_at = new Date()
    request.isSynced = false

    try {
      const sqlite = models.Supplier
      const mysql = getMode() === 'online' ? models.Supplier : null
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
        message: 'Supplier berhasil dibuat.',
        data: {
          saved_to_sqlite: sqliteData,
          saved_to_mysql: mysqlData
        }
      })
    } catch (error) {
      console.error('[CREATE ERROR]', error)
      res.status(500).json({ message: 'Internal Server Error', error })
    }
  }

  static async update(req: Request, res: Response) {
    const { id } = req.params
    const request: Partial<SupplierInterface> = req.body
    request.updated_at = new Date()

    try {
      const sqlite = models.Supplier
      const mysql = getMode() === 'online' ? models.Supplier : null
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
        res.status(404).json({ message: 'Supplier tidak ditemukan' })
      }

      res.status(200).json({
        message: 'Supplier berhasil diupdate',
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
      const sqlite = models.Supplier
      const mysql = getMode() === 'online' ? models.Supplier : null

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
        res.status(400).json({ message: 'Supplier tidak ditemukan' })
      }

      res.status(200).json({
        message: 'Supplier berhasil dihapus (hard delete)',
        deleted_from_mysql: mysqlDeleted,
        deleted_from_sqlite: sqliteDeleted
      })
    } catch (error) {
      console.error('[HARD DELETE ERROR]', error)
      res.status(500).json({ message: 'internal server error', error })
    }
  }
}

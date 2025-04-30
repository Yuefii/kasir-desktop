import { Request, Response } from 'express'
import { getMode } from '../database/conn'
import { models } from '../model'
import { InventoriInterface } from '../dto/inventori'

export class InventoriController {
  static async getAll(req: Request, res: Response) {
    try {
      const Inventori = models.Inventori

      const halaman = parseInt(req.query.halaman as string) || 1
      const limit = parseInt(req.query.limit as string) || 5
      const offset = (halaman - 1) * limit

      const { count, rows } = await Inventori.findAndCountAll({
        limit,
        offset,
        where: {
          is_aktif: true
        },
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
    request.jumlah_stok = 0
    request.created_at = new Date()
    request.updated_at = new Date()
    request.isSynced = false

    if (!request.id_produk || !request.id_cabang) {
      res.status(400).json({ message: 'id_produk dan id_cabang harus diisi' })
    }

    try {
      const sqlite = models.Inventori
      const mysql = getMode() === 'online' ? models.Inventori : null
      const sqliteCreated = await sqlite.create(request)

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

      let mysqlData = null

      if (mysql) {
        try {
          const mysqlRequest = { ...request, isSynced: true }
          const mysqlCreated = await mysql.create(mysqlRequest)
          await sqlite.update({ isSynced: true }, { where: { id: sqliteCreated.id } })
          mysqlData = await mysql.findOne({
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
          })
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
      const sqlite = models.Inventori
      const mysql = getMode() === 'online' ? models.Inventori : null
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

  static async softDelete(req: Request, res: Response) {
    const { id } = req.params

    try {
      const sqlite = models.Inventori
      const mysql = getMode() === 'online' ? models.Inventori : null

      const [sqliteUpdated] = await sqlite.update({ is_aktif: false }, { where: { id } })

      let mysqlUpdated = null

      if (mysql) {
        try {
          const [affectedCount] = await mysql.update(
            { is_aktif: false, isSynced: true },
            { where: { id } }
          )
          mysqlUpdated = affectedCount > 0 ? await mysql.findByPk(id) : null
        } catch (error) {
          console.error('[MYSQL ERROR] gagal update ke mysql:', error)
        }
      }

      if (sqliteUpdated === 0) {
        res.status(400).json({ message: 'inventori tidak ditemukan' })
      }

      res.status(200).json({
        message: 'inventori berhasil dihapus (soft delete)',
        deleted_from_mysql: mysqlUpdated,
        deleted_from_sqlite: sqliteUpdated
      })
    } catch (error) {
      console.error('[SOFT DELETE ERROR]', error)
      res.status(500).json({ message: 'internal server error', error })
    }
  }
}

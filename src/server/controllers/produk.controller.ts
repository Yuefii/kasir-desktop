import { Request, Response } from 'express'
import { ProdukModelFactory } from '../model/factory/produk_factory.model'
import { ProdukInstance, ProdukInterface } from '../model/produk'
import { getProdukModels } from '../model/helper/produk_model'
import { getMode } from '../database/conn'

export class ProdukController {
  static async getAll(req: Request, res: Response) {
    try {
      const { Produk } = await ProdukModelFactory()

      const halaman = parseInt(req.query.halaman as string) || 1
      const limit = parseInt(req.query.limit as string) || 5
      const offset = (halaman - 1) * limit

      const { count, rows } = await Produk.findAndCountAll({
        limit,
        offset,
        where: {
          is_aktif: true
        },
        attributes: {
          exclude: ['id_kategori']
        },
        include: [
          {
            association: 'kategori',
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
    const request: ProdukInterface = req.body
    request.created_at = new Date()
    request.updated_at = new Date()
    request.isSynced = false

    try {
      const { mysql, sqlite } = await getProdukModels()
      const mode = getMode()
      const sqliteCreated = (await sqlite.create(request as any)) as ProdukInstance

      const sqliteData = await sqlite.findOne({
        where: { id: sqliteCreated.id },
        include: [
          {
            association: 'kategori',
            attributes: ['id', 'nama']
          }
        ]
      })

      let mysqlData: ProdukInstance | null = null

      if (mode === 'online' && mysql) {
        try {
          const mysqlRequest = { ...request, isSynced: true }
          const mysqlCreated = (await mysql.create(mysqlRequest)) as ProdukInstance
          await sqlite.update(
            { isSynced: true },
            { where: { id: (sqliteCreated as ProdukInstance).id } }
          )
          mysqlData = (await mysql.findOne({
            where: { id: mysqlCreated.id },
            include: [
              {
                association: 'kategori',
                attributes: ['id', 'nama']
              }
            ]
          })) as ProdukInstance
        } catch (mysqlErr) {
          console.error('[MySQL ERROR] Gagal insert ke MySQL:', mysqlErr)
        }
      }
      res.status(201).json({
        message: 'Produk berhasil dibuat.',
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
    const request: Partial<ProdukInterface> = req.body
    request.updated_at = new Date()

    try {
      const { mysql, sqlite } = await getProdukModels()
      const mode = getMode()
      const [sqliteUpdated] = await sqlite.update(request, {
        where: { id }
      })

      let mysqlUpdated: ProdukInstance | null = null
      if (mode === 'online' && mysql) {
        try {
          const [affectedCount] = await mysql.update(
            { ...request, isSynced: true },
            { where: { id } }
          )
          mysqlUpdated =
            affectedCount > 0 ? ((await mysql.findByPk(id)) as ProdukInstance | null) : null
        } catch (error) {
          console.error('[MYSQL ERROR] gagal untuk update ke mysql:', error)
        }
      }

      if (sqliteUpdated === 0) {
        res.status(404).json({ message: 'produk tidak ditemukan' })
      }

      res.status(200).json({
        message: 'Produk berhasil diupdate',
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
      const { mysql, sqlite } = await getProdukModels()
      const mode = getMode()

      const [sqliteUpdated] = await sqlite.update({ is_aktif: false }, { where: { id } })

      let mysqlUpdated: ProdukInstance | null = null

      if (mode === 'online' && mysql) {
        try {
          const [affectedCount] = await mysql.update(
            { is_aktif: false, isSynced: true },
            { where: { id } }
          )
          mysqlUpdated =
            affectedCount > 0 ? ((await mysql.findByPk(id)) as ProdukInstance | null) : null
        } catch (error) {
          console.error('[MYSQL ERROR] gagal update ke mysql:', error)
        }
      }

      if (sqliteUpdated === 0) {
        res.status(400).json({ message: 'produk tidak ditemukan' })
      }

      res.status(200).json({
        message: 'produk berhasil dinonaktifkan (soft delete)',
        update_in_mysql: mysqlUpdated,
        update_in_sqlite: sqliteUpdated
      })
    } catch (error) {
      console.error('[SOFT DELETE ERROR]', error)
      res.status(500).json({ message: 'internal server error', error })
    }
  }
}

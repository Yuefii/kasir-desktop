import { models } from '@server/model'
import { getMode } from '@server/database/conn'
import { Model, Op } from 'sequelize'
import { Request, Response } from 'express'
import { InventoriInterface } from '@server/dto/inventori'
import { formatDateTime } from '@shared/helper/format_date'
import { Parser } from 'json2csv'
import { format } from 'date-fns'

export class InventoriController {
  static async getAll(req: Request, res: Response) {
    try {
      const Inventori = models.Inventori
      const paginationQuery = req.query.pagination
      const isPaginationDisabled = paginationQuery === 'false'

      const idCabang = req.query.cabang ? parseInt(req.query.cabang as string) : undefined

      const sortBy = (req.query.urut_berdasarkan as string) || 'created_at'
      const sortOrder = (req.query.urutan as string)?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC'

      const directSortFields = ['jumlah_stok', 'stok_minimal', 'created_at', 'updated_at']
      const relationalSortMap: Record<string, { model: any; as: string; field: string }> = {
        produk: { model: models.Produk, as: 'produk', field: 'nama' },
        cabang: { model: models.Cabang, as: 'cabang', field: 'nama' }
      }

      const searchQuery = (req.query.pencarian as string)?.toLowerCase() || ''
      const isSearching = searchQuery.length > 0

      let data: Model[]
      let count: number
      let order: any = [['created_at', sortOrder]]

      if (directSortFields.includes(sortBy)) {
        order = [[sortBy, sortOrder]]
      } else if (relationalSortMap[sortBy]) {
        const rel = relationalSortMap[sortBy]
        order = [
          [
            {
              model: rel.model,
              as: rel.as
            },
            rel.field,
            sortOrder
          ]
        ]
      }

      const whereClause: any = {
        is_aktif: true
      }

      if (idCabang) {
        whereClause.id_cabang = idCabang
      }

      if (isPaginationDisabled) {
        data = await Inventori.findAll({
          where: whereClause,
          attributes: {
            exclude: ['id_produk', 'id_cabang']
          },
          include: [
            {
              association: 'produk',
              attributes: ['id', 'nama'],
              where: isSearching
                ? {
                    nama: {
                      [Op.like]: `%${searchQuery}%`
                    }
                  }
                : undefined
            },
            {
              association: 'cabang',
              attributes: ['id', 'nama']
            }
          ],
          order
        })
        count = data.length
      } else {
        const halaman = parseInt(req.query.halaman as string) || 1
        const limit = parseInt(req.query.limit as string) || 5
        const offset = (halaman - 1) * limit

        const result = await Inventori.findAndCountAll({
          where: whereClause,
          attributes: {
            exclude: ['id_produk', 'id_cabang']
          },
          include: [
            {
              association: 'produk',
              attributes: ['id', 'nama'],
              where: isSearching
                ? {
                    nama: {
                      [Op.like]: `%${searchQuery}%`
                    }
                  }
                : undefined
            },
            {
              association: 'cabang',
              attributes: ['id', 'nama']
            }
          ],
          order,
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

  static async exportCSV(req: Request, res: Response) {
    try {
      const Inventori = models.Inventori
      const idCabang = req.query.cabang ? parseInt(req.query.cabang as string) : undefined
      const sortBy = (req.query.urut_berdasarkan as string) || 'created_at'
      const sortOrder = (req.query.urutan as string)?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC'

      const directSortFields = ['jumlah_stok', 'stok_minimal', 'created_at', 'updated_at']
      const relationalSortMap: Record<string, { model: any; as: string; field: string }> = {
        produk: { model: models.Produk, as: 'produk', field: 'nama' },
        cabang: { model: models.Cabang, as: 'cabang', field: 'nama' }
      }

      const searchQuery = (req.query.pencarian as string)?.toLowerCase() || ''
      const isSearching = searchQuery.length > 0

      let order: any = [['created_at', sortOrder]]

      if (directSortFields.includes(sortBy)) {
        order = [[sortBy, sortOrder]]
      } else if (relationalSortMap[sortBy]) {
        const rel = relationalSortMap[sortBy]
        order = [[{ model: rel.model, as: rel.as }, rel.field, sortOrder]]
      }

      const whereClause: any = {
        is_aktif: true
      }

      if (idCabang) {
        whereClause.id_cabang = idCabang
      }

      const data = await Inventori.findAll({
        where: whereClause,
        attributes: {
          exclude: ['id_cabang', 'id_produk']
        },
        include: [
          {
            association: 'produk',
            attributes: ['id', 'nama'],
            where: isSearching
              ? {
                  nama: {
                    [Op.like]: `%${searchQuery}%`
                  }
                }
              : undefined
          },
          {
            association: 'cabang',
            attributes: ['id', 'nama']
          }
        ],
        order
      })

      const plainData = data.map((item: any) => {
        return {
          'Jumlah Stok': item.jumlah_stok,
          'Stok Minimal': item.stok_minimal,
          'Nama Produk': item.produk?.nama || '',
          'Nama Cabang': item.cabang?.nama || '',
          'Dibuat Pada': item.created_at ? formatDateTime(item.created_at) : '',
          'Diubah Pada': item.updated_at ? formatDateTime(item.updated_at) : ''
        }
      })

      const json2csv = new Parser()
      const csv = json2csv.parse(plainData)
      const today = format(new Date(), 'dd-MM-yyyy')
      const fileName = `data-inventori-${today}.csv`

      res.setHeader('Content-Disposition', `attachment; filename=${fileName}`)
      res.setHeader('Content-Type', 'text/csv')
      res.status(200).send(csv)
    } catch (error) {
      console.error('Gagal export CSV:', error)
      res.status(500).json({ message: 'Gagal export data', error })
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

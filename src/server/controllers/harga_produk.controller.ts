import { Parser } from 'json2csv'
import { models } from '@server/model'
import { Model, Op } from 'sequelize'
import { Request, Response } from 'express'
import { format } from 'date-fns'
import { formatDateTime } from '@shared/helper/format_date'
import { formatRupiah } from '@shared/helper/format_rupiah'

export class HargaProdukController {
  static async getAll(req: Request, res: Response) {
    try {
      const HargaProduk = models.HargaProduk
      const paginationQuery = req.query.pagination
      const isPaginationDisabled = paginationQuery === 'false'

      const sortBy = (req.query.urut_berdasarkan as string) || 'created_at'
      const sortOrder = (req.query.urutan as string)?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC'

      const allowSortFields = ['harga', 'mulai_berlaku', 'created_at', 'updated_at']
      const sortField = allowSortFields.includes(sortBy) ? sortBy : 'created_at'

      const searchQuery = (req.query.pencarian as string)?.toLowerCase() || ''
      const isSearching = searchQuery.length > 0

      let data: Model[]
      let count: number

      if (isPaginationDisabled) {
        data = await HargaProduk.findAll({
          where: {
            is_aktif: true
          },
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
          order: [[sortField, sortOrder]]
        })
        count = data.length
      } else {
        const halaman = parseInt(req.query.halaman as string) || 1
        const limit = parseInt(req.query.limit as string) || 5
        const offset = (halaman - 1) * limit

        const result = await HargaProduk.findAndCountAll({
          where: {
            is_aktif: true
          },
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
          order: [[sortField, sortOrder]],
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
      const HargaProduk = models.HargaProduk

      const sortBy = (req.query.urut_berdasarkan as string) || 'created_at'
      const sortOrder = (req.query.urutan as string)?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC'
      const allowSortFields = ['harga', 'mulai_berlaku', 'created_at', 'updated_at']
      const sortField = allowSortFields.includes(sortBy) ? sortBy : 'created_at'

      const searchQuery = (req.query.pencarian as string)?.toLowerCase() || ''
      const isSearching = searchQuery.length > 0

      const data = await HargaProduk.findAll({
        where: {
          is_aktif: true
        },
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
        order: [[sortField, sortOrder]]
      })

      const plainData = data.map((item: any) => {
        return {
          'Nama Produk': item.produk?.nama || '',
          'Nama Cabang': item.cabang?.nama || '',
          'Harga Produk': formatRupiah(item.harga),
          'Mulai Berlaku': item.mulai_berlaku ? formatDateTime(item.mulai_berlaku) : '',
          'Dibuat Pada': item.created_at ? formatDateTime(item.created_at) : '',
          'Diubah Pada': item.updated_at ? formatDateTime(item.updated_at) : ''
        }
      })

      const json2csv = new Parser()
      const csv = json2csv.parse(plainData)
      const today = format(new Date(), 'dd-MM-yyyy')
      const fileName = `data-harga-produk-${today}.csv`

      res.setHeader('Content-Disposition', `attachment; filename=${fileName}`)
      res.setHeader('Content-Type', 'text/csv')
      res.status(200).send(csv)
    } catch (error) {
      console.error('Gagal export CSV:', error)
      res.status(500).json({ message: 'Gagal export data', error })
    }
  }
}

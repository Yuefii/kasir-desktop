import { Model } from 'sequelize'
import { models } from '@server/model'
import { Request, Response } from 'express'

export class HargaProdukController {
  static async getAll(req: Request, res: Response) {
    try {
      const HargaProduk = models.HargaProduk
      const paginationQuery = req.query.pagination
      const isPaginationDisabled = paginationQuery === 'false'

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
              attributes: ['id', 'nama']
            },
            {
              association: 'cabang',
              attributes: ['id', 'nama']
            }
          ]
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
              attributes: ['id', 'nama']
            },
            {
              association: 'cabang',
              attributes: ['id', 'nama']
            }
          ],
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
}

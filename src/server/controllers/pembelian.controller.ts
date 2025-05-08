import { Op } from 'sequelize'
import { models } from '../model'
import { getMode } from '../database/conn'
import { Request, Response } from 'express'
import { PembelianInterface } from '@server/dto/pembelian'

const DEFAULT_MARGIN = 0.3

export class PembelianController {
  static async getAll(req: Request, res: Response) {
    try {
      const Pembelian = models.Pembelian
      const paginationQuery = req.query.pagination as string | undefined
      const isPaginationDisabled = paginationQuery === 'false'

      const queryOptions: any = {
        attributes: {
          exclude: ['id_supplier', 'id_cabang']
        },
        include: [
          {
            association: 'supplier',
            attributes: ['id', 'nama']
          },
          {
            association: 'cabang',
            attributes: ['id', 'nama']
          },
          {
            association: 'pembelian_item',
            attributes: ['jumlah', 'harga'],
            include: [
              {
                association: 'produk',
                attributes: ['id', 'nama'],
                include: [
                  {
                    association: 'kategori',
                    attributes: ['id', 'nama']
                  }
                ]
              }
            ]
          }
        ],
        order: [['created_at', 'DESC']]
      }
      if (isPaginationDisabled) {
        const pembelian = await Pembelian.findAll(queryOptions)
        res.status(200).json({
          pagination: false,
          data: pembelian
        })
      } else {
        const halaman = parseInt(req.query.halaman as string) || 1
        const limit = parseInt(req.query.limit as string) || 5
        const offset = (halaman - 1) * limit

        queryOptions.limit = limit
        queryOptions.offset = offset

        const { count, rows } = await Pembelian.findAndCountAll(queryOptions)
        res.status(200).json({
          pagination: {
            total_data: count,
            halaman_sekarang: halaman,
            data_per_halaman: limit,
            total_halaman: Math.ceil(count / limit)
          },
          data: rows
        })
      }
    } catch (error) {
      console.error('[GET ALL ERROR]', error)
      res.status(500).json({
        message: 'Gagal mengambil data pembelian.',
        error: error instanceof Error ? error.message : error
      })
    }
  }

  static async create(req: Request, res: Response) {
    const request: PembelianInterface = req.body
    request.created_at = new Date()
    request.updated_at = new Date()
    request.isSynced = false

    // Validasi awal
    if (!Array.isArray(request.items) || request.items.length === 0) {
      res.status(400).json({ message: 'Items pembelian tidak boleh kosong.' })
    }

    const sqliteModels = models
    const mysqlModels = getMode() === 'online' ? models : null

    const transaction = await sqliteModels.Pembelian.sequelize.transaction()

    try {
      console.log('>> Membuat pembelian:', request)

      // 1. Hitung total pembelian
      const totalPembelian = request.items.reduce((sum, item) => sum + item.jumlah * item.harga, 0)
      console.log('>> Total pembelian:', totalPembelian)

      request.total_pembelian = totalPembelian
      request.status = 'selesai'

      // 2. Simpan pembelian
      const pembelian = await sqliteModels.Pembelian.create(request, { transaction })

      // 3. Proses setiap item pembelian
      for (const item of request.items) {
        console.log('>> Proses item:', item)

        const { id_produk, jumlah, harga } = item

        // 3.1 Simpan item pembelian
        await sqliteModels.PembelianItem.create(
          {
            id_pembelian: pembelian.id,
            id_produk,
            jumlah,
            harga,
            is_synced: false
          },
          { transaction }
        )

        // 3.2 Update atau insert inventori
        const [inventori, created] = await sqliteModels.Inventori.findOrCreate({
          where: { id_produk, id_cabang: request.id_cabang },
          defaults: {
            jumlah_stok: jumlah,
            stok_minimal: 0
          },
          transaction
        })

        if (!created) {
          inventori.jumlah_stok += jumlah
          await inventori.save({ transaction })
        }

        // step 3.3 Cek harga beli terakhir
        const lastItem = await sqliteModels.PembelianItem.findOne({
          where: {
            id_produk,
            created_at: { [Op.lt]: new Date() }
          },
          order: [['created_at', 'DESC']],
          transaction
        })

        const lastHarga = lastItem ? lastItem.harga : harga
        const selisih = harga - lastHarga

        // step 3.4 Hitung margin dinamis
        let margin = DEFAULT_MARGIN
        if (selisih > 10000) margin = 0.25
        else if (selisih < -10000) margin = 0.35

        const hargaJual = Math.round(harga * (1 + margin))

        // step 3.5 Nonaktifkan harga lama
        await sqliteModels.HargaProduk.update(
          { is_aktif: false },
          {
            where: {
              id_produk,
              id_cabang: request.id_cabang,
              is_aktif: true
            },
            transaction
          }
        )

        // 3.6 Simpan harga baru
        await sqliteModels.HargaProduk.create(
          {
            id_produk,
            id_cabang: request.id_cabang,
            harga: hargaJual,
            mulai_berlaku: new Date(),
            is_aktif: true,
            is_synced: false
          },
          { transaction }
        )
      }

      await transaction.commit()

      // 4. Sync ke MySQL jika mode online
      let mysqlData = null
      if (mysqlModels) {
        try {
          const mysqlRequest = { ...request, isSynced: true }

          const mysqlPembelian = await mysqlModels.Pembelian.create(mysqlRequest)
          for (const item of request.items) {
            await mysqlModels.PembelianItem.create({
              ...item,
              id_pembelian: mysqlPembelian.id,
              is_synced: true
            })
          }

          await sqliteModels.Pembelian.update({ is_synced: true }, { where: { id: pembelian.id } })
          mysqlData = mysqlPembelian
        } catch (mysqlErr) {
          console.error('[MySQL ERROR] Gagal insert ke MySQL:', mysqlErr)
        }
      }

      res.status(201).json({
        message: 'Pembelian berhasil disimpan.',
        data: {
          savedToSQLite: pembelian,
          savedToMySQL: mysqlData
        }
      })
    } catch (error) {
      await transaction.rollback()
      console.error('[CREATE ERROR]', error)
      res.status(500).json({
        message: 'Terjadi kesalahan internal.',
        error: error instanceof Error ? error.message : error
      })
    }
  }
}

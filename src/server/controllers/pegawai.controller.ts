import bcrypt from 'bcrypt'
import { models } from '../model'
import { getMode } from '../database/conn'
import { Request, Response } from 'express'
import { PegawaiInterface } from '../dto/pegawai'

export class PegawaiController {
  static async getAll(req: Request, res: Response) {
    try {
      const Pegawai = models.Pegawai

      const halaman = parseInt(req.query.halaman as string) || 1
      const limit = parseInt(req.query.limit as string) || 5
      const offset = (halaman - 1) * limit

      const { count, rows } = await Pegawai.findAndCountAll({
        attributes: {
          exclude: 'password'
        },
        where: { is_aktif: true },
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
    const request: PegawaiInterface = req.body
    request.created_at = new Date()
    request.updated_at = new Date()
    request.isSynced = false
    request.role = 'operator'

    try {
      if (request.password) {
        request.password = await bcrypt.hash(request.password, 10)
      }

      const sqlite = models.Pegawai
      const mysql = getMode() === 'online' ? models.Pegawai : null

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
        message: 'Pegawai berhasil dibuat.',
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
    const request: Partial<PegawaiInterface> = req.body

    try {
      const sqlite = models.Pegawai
      const mysql = getMode() === 'online' ? models.Pegawai : null
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
        res.status(404).json({ message: 'pegawai tidak ditemukan' })
      }

      res.status(200).json({
        message: 'pegawai berhasil diupdate',
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
      const sqlite = models.Pegawai
      const mysql = getMode() === 'online' ? models.Pegawai : null

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
        res.status(400).json({ message: 'pegawai tidak ditemukan' })
      }

      res.status(200).json({
        message: 'pegawai berhasil dinonaktifkan (soft delete)',
        update_in_mysql: mysqlUpdated,
        update_in_sqlite: sqliteUpdated
      })
    } catch (error) {
      console.error('[SOFT DELETE ERROR]', error)
      res.status(500).json({ message: 'internal server error', error })
    }
  }
}

import { DB } from '../database/config'
import { Cabang } from '../dto/cabang'
import { Request, Response } from 'express'
import { buildInsertQuery, buildUpdateQuery } from '../utils/query'

export class CabangController {
  static async getAll(req: Request, res: Response) {
    const halaman = parseInt(req.query.halaman as string) || 1
    const limit = parseInt(req.query.limit as string) || 5
    const offset = (halaman - 1) * limit
    try {
      const data = await DB.query('SELECT * FROM cabang LIMIT ? OFFSET ?', [limit, offset])
      const totalData = await DB.query('SELECT COUNT(*) as total FROM cabang')
      const total = totalData[0].total
      const totalHalaman = Math.ceil(total / limit)

      res.status(200).json({
        pagination: {
          halaman_saat_ini: halaman,
          total_halaman: totalHalaman,
          total_data: total,
          limit_data: limit
        },
        data: data
      })
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error', error })
    }
  }

  static async create(req: Request, res: Response) {
    const request: Cabang = req.body
    request.is_active = true
    request.created_at = new Date()

    try {
      const sql = buildInsertQuery('cabang', request)
      const values = Object.values(request)
      const result = await DB.query(sql, values)
      const newCabang = {
        id: (result as any).insertId,
        ...request
      }
      res.status(201).json({ message: 'Cabang berhasil dibuat.', data: newCabang })
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error', error })
    }
  }

  static async update(req: Request, res: Response) {
    const { id } = req.params
    const request: Partial<Cabang> = req.body

    try {
      const sql = buildUpdateQuery('cabang', request, 'id = ?')
      const values = [...Object.values(request), id]

      const result = await DB.execute(sql, values)

      if ((result as any).affectedRows > 0) {
        const updatedCabang = await DB.query('SELECT * FROM cabang WHERE id = ?', [id])
        res.json(updatedCabang[0])
      } else {
        res.status(404).json({ message: 'Cabang not found' })
      }
    } catch (error) {
      res.status(400).json({ message: 'Error updating cabang', error })
    }
  }

  static async delete(req: Request, res: Response) {
    const { id } = req.params

    try {
      const result = await DB.execute('UPDATE cabang SET is_active = 0 WHERE id = ?', [id])

      if ((result as any).affectedRows > 0) {
        res.json({ message: 'Berhasil menghapus cabang' })
      } else {
        res.status(404).json({ message: 'Cabang tidak ditemukan' })
      }
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error', error })
    }
  }
}

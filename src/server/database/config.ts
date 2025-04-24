import mysql from 'mysql2/promise'
import { credentials } from './credentials'
import { CabangRepository } from '../repositories/cabang.repository'

export class DB {
  private static pool = mysql.createPool(credentials)

  static async initializeDatabase() {
    const conn = await this.pool.getConnection()
    try {
      await conn.query(`USE ${credentials.database}`)
      // Create Table
      await CabangRepository.createTable(conn)
    } catch (error) {
      throw error
    } finally {
      conn.release()
    }
  }

  static async query(sql: string, value?: any[]) {
    const conn = await this.pool.getConnection()
    try {
      const [rows] = await conn.query(sql, value)
      return rows
    } catch (error) {
      conn.release()
      throw error
    }
  }

  static async execute(sql: string, values?: any[]) {
    const conn = await this.pool.getConnection()
    try {
      const [result] = await conn.execute(sql, values)
      return result
    } finally {
      conn.release()
    }
  }
}

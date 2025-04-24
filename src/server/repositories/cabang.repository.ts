export class CabangRepository {
  static createTableQuery = `
    CREATE TABLE IF NOT EXISTS cabang (
      id INT AUTO_INCREMENT PRIMARY KEY,
      kode_cabang VARCHAR(20) UNIQUE NOT NULL,
      nama VARCHAR(100) NOT NULL,
      alamat TEXT NOT NULL,
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `

  static async createTable(connection: any) {
    await connection.query(this.createTableQuery)
  }
}

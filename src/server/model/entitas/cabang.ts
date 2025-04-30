import { DataTypes } from 'sequelize'

export const cabang = {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  kode_cabang: {
    type: DataTypes.STRING(20),
    unique: true,
    allowNull: false
  },
  nama: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  alamat: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  is_aktif: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  isSynced: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}

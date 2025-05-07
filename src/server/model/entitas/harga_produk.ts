import { DataTypes } from 'sequelize'

export const hargaProduk = {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  harga: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  mulai_berlaku: {
    type: DataTypes.DATE,
    allowNull: false
  },
  id_produk: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  id_cabang: {
    type: DataTypes.INTEGER,
    allowNull: true
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
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}

import { DataTypes } from 'sequelize'

export const inventori = {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  jumlah_stok: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  stok_minimal: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  id_cabang: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  id_produk: {
    type: DataTypes.INTEGER,
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
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}

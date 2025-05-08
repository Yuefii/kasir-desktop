import { DataTypes } from 'sequelize'

export const pembelianItem = {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  jumlah: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  harga: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  id_produk: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'produk',
      key: 'id'
    }
  },
  id_pembelian: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'pembelian',
      key: 'id'
    }
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

import { CabangModelFactory } from './factory/cabang_factory.model'
import { InventoriModelFactory } from './factory/inventori_factory.model'
import { KategoriModelFactory } from './factory/kategori_factory.model'
import { ProdukModelFactory } from './factory/produk_factory.model'
import { SupplierModelFactory } from './factory/supplier_factory.model'

let models: {
  Cabang: Awaited<ReturnType<typeof CabangModelFactory>>
  Kategori: Awaited<ReturnType<typeof KategoriModelFactory>>
  Produk: Awaited<ReturnType<typeof ProdukModelFactory>>
  Supplier: Awaited<ReturnType<typeof SupplierModelFactory>>
  Inventori: Awaited<ReturnType<typeof InventoriModelFactory>>
}

export async function initModels() {
  const Cabang = await CabangModelFactory()
  const Kategori = await KategoriModelFactory()
  const Produk = await ProdukModelFactory()
  const Supplier = await SupplierModelFactory()
  const Inventori = await InventoriModelFactory()

  models = {
    Cabang,
    Kategori,
    Produk,
    Supplier,
    Inventori
  }

  return models
}

export function getModels() {
  return models
}

export async function syncAllModels() {
  const models = await initModels()
  for (const model of Object.values(models)) {
    await model.sync()
  }
}

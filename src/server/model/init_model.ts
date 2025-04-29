import { CabangModelFactory } from './factory/cabang_factory.model'
import { KategoriModelFactory } from './factory/kategori_factory.model'

let models: {
  Cabang: Awaited<ReturnType<typeof CabangModelFactory>>
  Kategori: Awaited<ReturnType<typeof KategoriModelFactory>>
}

export async function initModels() {
  const Cabang = await CabangModelFactory()
  const Kategori = await KategoriModelFactory()

  models = {
    Cabang,
    Kategori
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

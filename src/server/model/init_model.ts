import { CabangModelFactory } from './factory/cabang_factory.model'

let models: {
  Cabang: Awaited<ReturnType<typeof CabangModelFactory>>
}

export async function initModels() {
  const Cabang = await CabangModelFactory()

  models = {
    Cabang
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

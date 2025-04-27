import cors from 'cors'
import router from './routes'
import express from 'express'
import { getMode, tryConnectMySQL } from './database/conn'
import { isConnectedToInternet } from './utils/check_connection'
import { syncAllModels } from './model/init_model'

export async function startExpress() {
  const app = express()
  const PORT = 3001

  const online = await isConnectedToInternet()
  if (online) {
    await tryConnectMySQL()
  } else {
    await syncAllModels()
  }

  app.use(cors())
  app.use(express.json())

  app.use('/api', router)

  app.get('/mode', (_, res) => {
    res.json({ mode: getMode() })
  })

  const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })

  return server
}

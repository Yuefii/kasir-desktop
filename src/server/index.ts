import cors from 'cors'
import router from './routes'
import express from 'express'
import { getMode, switchToOffline, tryConnectMySQL } from './database/conn'
import { isConnectedToInternet } from '@shared/helper/check_connection'

export async function startExpress() {
  const app = express()
  const PORT = 3001

  const online = await isConnectedToInternet()
  if (online) {
    await tryConnectMySQL()
  } else {
    await switchToOffline()
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

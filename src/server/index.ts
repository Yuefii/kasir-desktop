import cors from 'cors'
import router from './routes'
import express from 'express'
import { getMode, tryConnectMySQL } from './database/conn'
import { isConnectedToInternet } from './utils/check_connection'
import { syncAllModels } from './model/init_model'
import { getSyncStatus } from './services/sync_status.service'
import { manualSyncAllTables } from './services/sync_manual.service'

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

  app.get('/sync/status', async (_req, res) => {
    try {
      const status = await getSyncStatus()
      res.json(status)
    } catch (err) {
      console.error('[SYNC STATUS ERROR]', err)
      res.status(500).json({
        message: 'Gagal cek status sinkronisasi',
        error: (err as any).message
      })
    }
  })

  app.post('/sync/manual', async (_req, res) => {
    try {
      const result = await manualSyncAllTables()
      res.json({
        message: 'Sinkronisasi manual selesai',
        result
      })
    } catch (error) {
      console.error('[MANUAL SYNC ERROR]', error)
      res.status(500).json({ message: 'Gagal sinkronisasi manual', error })
    }
  })

  app.get('/mode', (_, res) => {
    res.json({ mode: getMode() })
  })

  const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })

  return server
}

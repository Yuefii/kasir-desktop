import { Router } from 'express'
import { CabangController } from '../controllers/cabang.controller'
import { SyncController } from '../controllers/sync.controller'

const router = Router()

router.get('/cabang', CabangController.getAll)
router.post('/cabang', CabangController.create)

router.get('/sync/status', SyncController.SyncStatus)
router.post('/sync/manual', SyncController.SyncManual)

export default router

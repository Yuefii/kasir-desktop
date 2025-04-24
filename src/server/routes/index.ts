import { Router } from 'express'
import { CabangController } from '../controllers/cabang.controller'

const router = Router()

router.get('/cabang', CabangController.getAll)
router.post('/cabang', CabangController.create)
router.patch('/cabang/:id', CabangController.update)
router.delete('/cabang/:id', CabangController.delete)

export default router

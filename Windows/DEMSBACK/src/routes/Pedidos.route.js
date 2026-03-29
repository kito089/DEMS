import { Router } from 'express';
import ctrl from '../controllers/Pedidos.controller.js';

const router = Router();

router.get('/', ctrl.getAll);
router.get('/:id/detalles', ctrl.getDetalles);
router.post('/', ctrl.create);
router.put('/:id/finalizar', ctrl.finalizar);
router.put('/:id/cancelar', ctrl.cancelar);
export default router;
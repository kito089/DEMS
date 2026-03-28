import { Router } from 'express';
import ctrl from '../controllers/Trabajadores.controller.js';

const router = Router();

router.get('/structure', ctrl.getStructure);
router.post('/login', ctrl.login);

router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getById);
router.post('/', ctrl.create);
router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.remove);

export default router;
const { Router } = require('express');
const ctrl = require('./controllers/pagos.controller');
 
const router = Router();
 
// Rutas estáticas primero para evitar conflicto con /:id
router.get('/pedido/:idPedido', ctrl.getByPedido);
 
router.get('/',    ctrl.getAll);
router.get('/:id', ctrl.getById);
router.post('/',   ctrl.create);
 
module.exports = router;
const { Router } = require('express');
const ctrl = require('./controllers/platillos.controller');

const router = Router();

// Rutas estáticas primero para evitar conflicto con /:id
router.get('/structure', ctrl.getStructure);
router.get('/menu',      ctrl.getMenu);

router.get('/',       ctrl.getAll);
router.get('/:id',    ctrl.getById);
router.post('/',      ctrl.create);
router.put('/:id',    ctrl.update);
router.delete('/:id', ctrl.remove);

module.exports = router;
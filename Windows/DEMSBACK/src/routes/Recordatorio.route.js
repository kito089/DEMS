import express from 'express';
import { enviarRecordatorios } from '../controllers/Recordatorio.controller.js';
import { pruebaTicket } from '../controllers/Recordatorio.controller.js';


const router = express.Router();

router.post('/enviarRecordatorios', enviarRecordatorios);
router.get('/ticket', pruebaTicket);
export default router;
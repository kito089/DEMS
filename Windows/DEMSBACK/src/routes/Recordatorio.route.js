import express from 'express';
import { enviarRecordatorios } from '../controllers/Recordatorio.controller.js';

const router = express.Router();

router.post('/enviarRecordatorios', enviarRecordatorios);

export default router;
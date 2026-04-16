import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import ctrl from '../controllers/Platillos.controller.js';

const router = Router();

// ── Configuración de multer ────────────────────────────────────────────────
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const imagesDir = path.join(__dirname, '..', 'images', 'platillos');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, imagesDir),
    // Nombre del archivo: {idPlatillo}.{ext}  → ej. 5.jpg
    // Si el platillo ya tenía imagen, la sobreescribe automáticamente.
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, `${req.params.id}${ext}`);
    }
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) cb(null, true);
        else cb(new Error('Solo se permiten archivos de imagen'));
    },
    limits: { fileSize: 5 * 1024 * 1024 } // 5 MB máximo
});

// Rutas estáticas primero
router.get('/structure', ctrl.getStructure);
router.get('/menu', ctrl.getMenu);

router.get('/', ctrl.getAll);
router.get('/completo', ctrl.getCompleto);
router.get('/:id', ctrl.getById);
router.post('/', ctrl.create);
router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.remove);

// ── Subida de imagen ───────────────────────────────────────────────────────
// POST /Platillos/:id/imagen  — multipart/form-data, campo "imagen"
router.post('/:id/imagen', upload.single('imagen'), ctrl.uploadImagen);

export default router;
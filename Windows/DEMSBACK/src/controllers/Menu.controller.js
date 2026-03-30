import { generarMenuPDF } from '../services/Menu.service.js';

// GET /menu/pdf
const getMenuPDF = async (_req, res) => {
    try {
        const urlData = await generarMenuPDF();
        res.status(200).json({
            message: 'PDF generado y subido exitosamente a Cloudinary',
            success: true,
            data: {
                // URL base (parámetro por defecto)
                url: urlData.secure_url,
                // URLs con flags específicos
                previewUrl: urlData.previewUrl,    // Ver en navegador (inline)
                downloadUrl: urlData.downloadUrl,  // Descargar
                // Para referencia
                publicId: urlData.publicId,
            }
        });
    } catch (e) {
        console.error('Error en getMenuPDF:', e);
        res.status(500).json({ 
            success: false,
            error: e.message 
        });
    }
};

export default { getMenuPDF };
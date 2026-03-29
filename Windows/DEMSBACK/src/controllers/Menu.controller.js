import { generarMenuPDF } from '../services/Menu.service.js';

// GET /menu/pdf
const getMenuPDF = async (_req, res) => {
    try {
        await generarMenuPDF(res);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

export default { getMenuPDF };
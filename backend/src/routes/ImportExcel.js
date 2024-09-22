import express from 'express';
import { pool } from '../database/conexion.js';
import { InsertMatriculas } from '../controllers/matriculas.controller.js';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import xlsx from 'xlsx';

const upload = multer({ dest: 'uploads/' });

const router = express.Router();

router.post('/import', upload.single('file'), async (req, res) => {
    try {
        const file = req.file;
        if (!file) {
            throw new Error('No se ha subido ningún archivo');
        }

        const workbook = xlsx.readFile(path.join(__dirname, '..', '..', 'uploads', file.filename));
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(worksheet);

        // Procesa los datos antes de insertarlos
        const processedData = data.map(row => ({
            ficha: row.Ficha,
            aprendiz: row.Aprendiz,
            estado: row.Estado,
            pendiente_tecnicos: row['Técnicos Pendientes'] ?? 0,
            pendiente_transversales: row['Transversales Pendientes'] ?? 0,
            pendiente_ingles: row['Inglés Pendiente'] ?? 0
        }));

        // Inserta los datos en la base de datos
        await InsertMatriculas(pool, processedData);

        // Borra el archivo temporal
        fs.unlinkSync(path.join(__dirname, '..', '..', 'uploads', file.filename));

        res.status(200).json({ message: 'Datos importados exitosamente' });
    } catch (error) {
        console.error('Error al importar datos:', error);
        res.status(500).json({ message: 'Error al importar datos', details: error.message });
    }
});

export default router;

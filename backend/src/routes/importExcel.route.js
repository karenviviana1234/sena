import express from 'express';
import { importExcel, upload } from '../controllers/importarExcel.js'; // Asegúrate de que la ruta sea correcta

const rutaImportarExcel = express.Router();

// Ruta para importar archivos Excel
rutaImportarExcel.post('/import', upload.single('file'), importExcel);

export default rutaImportarExcel;

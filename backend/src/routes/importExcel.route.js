<<<<<<< HEAD
import { Router } from 'express';
import { importExcel, upload } from '../controllers/importarExcel.js'; // Asegúrate de que la ruta sea correcta

const rutaImportarExcel = Router();

// Solo usa 'upload' aquí, ya que .single('file') está definido en el controlador
rutaImportarExcel.post('/import', upload, importExcel);
=======
import express from 'express';
import { importExcel, upload } from '../controllers/importarExcel.js'; // Asegúrate de que la ruta sea correcta

const rutaImportarExcel = express.Router();

// Ruta para importar archivos Excel
rutaImportarExcel.post('/import', upload.single('file'), importExcel);
>>>>>>> 2f26bb9f189b1ea7057056e49def6f0ea00a3a9a

export default rutaImportarExcel;

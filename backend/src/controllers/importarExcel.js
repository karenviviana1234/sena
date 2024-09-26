import { pool } from './../database/conexion.js'; // Asegúrate de que esta ruta sea correcta
import multer from 'multer';
import XLSX from 'xlsx';

// Configuración de multer para almacenar archivos en memoria
const storage = multer.memoryStorage();
export const upload = multer({ storage });

// Controlador para importar datos desde un archivo Excel
export const importExcel = async (req, res) => {
    try {
        // Verifica si se subió un archivo
        if (!req.file) {
            return res.status(400).json({ message: 'No se ha subido ningún archivo.' });
        }

        // Procesa el archivo Excel
        const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet);

        // Depuración: imprimir jsonData
        console.log(jsonData);

        // Aquí se prepara el array de valores para la inserción
        const values = jsonData.map(item => [
            item.Ficha || null,  // Asegúrate de que el nombre sea exacto
            item.Aprendiz || null,
            item.Estado || null,
            item['Pendientes Técnicos'] || null,
            item['Pendientes Transversales'] || null,
            item['Pendientes Inglés'] || null
        ]);

        // Construir la consulta SQL con marcadores de posición
        const placeholders = values.map(() => '(?, ?, ?, ?, ?, ?)').join(', ');
        const sql = `INSERT INTO matriculas (ficha, aprendiz, estado, pendiente_tecnicos, pendiente_transversales, pendiente_ingles) VALUES ${placeholders}`;

        // Aplanar el array de valores
        const flatValues = values.flat();

        // Realizar la inserción de todas las filas a la vez
        await pool.query(sql, flatValues);

        // Respuesta exitosa
        res.status(200).json({ message: 'Datos importados exitosamente' });
    } catch (error) {
        console.error('Error al importar Excel:', error);
        res.status(500).json({ message: 'Hubo un error al importar los datos.' });
    }
};

// Exportar el middleware de multer

import { pool } from './../database/conexion.js'; // Asegúrate de que esta ruta sea correcta
import multer from 'multer';
import XLSX from 'xlsx';
import bcrypt from 'bcrypt';

// Configuración de multer para almacenar archivos en memoria
const storage = multer.memoryStorage();
export const upload = multer({ storage }).single('file'); // Asegúrate de que el campo sea 'file'

// Controlador para importar datos desde un archivo Excel
export const importExcel = async (req, res) => {
    try {
        // Verificar si se ha subido un archivo
        if (!req.file) {
            return res.status(400).json({ message: 'No se ha subido ningún archivo.' });
        }

        // Leer el archivo Excel desde el buffer
        const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];

        // Convertir la hoja de Excel a JSON
        const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1, raw: true });

        // Verificar si los datos están vacíos
        if (jsonData.length === 0) {
            return res.status(400).json({ message: 'El archivo Excel está vacío.' });
        }

        // Obtener los datos sin cabecera
        const data = jsonData.slice(1).map(row => ({
            identificacion: row[0],
            aprendiz: row[1],
            ficha: row[2],
            correo: row[3],
            telefono: row[4],
            municipio: row[5],
            estado_matricula: row[6],
            pendiente_tecnicos: row[7] || 0,
            pendiente_transversales: row[8] || 0,
            pendiente_ingles: row[9] || 0
        }));

        // Verificar si hay datos válidos para insertar
        if (data.length === 0) {
            return res.status(400).json({ message: 'No se encontraron datos válidos en el archivo Excel.' });
        }

        // Iterar sobre cada registro del Excel
        for (const item of data) {
            const municipioName = item.municipio ? item.municipio.trim() : '';
            console.log(`Buscando ID para el municipio: ${municipioName}`);

            // Verificar si el municipio ya existe en la base de datos
            if (!municipioName) {
                console.error(`El municipio está vacío para el aprendiz ${item.aprendiz}`);
                continue; // Saltar a la siguiente iteración
            }

            // Realiza la consulta
            const municipioQuery = await pool.query(
                'SELECT id_municipio FROM municipios WHERE LOWER(nombre_mpio) = LOWER(?)',
                [municipioName]
            );

            // Verifica la estructura del resultado
            console.log('Resultado de la consulta de municipio:', municipioQuery);

            // Asegúrate de acceder correctamente al resultado
            let municipioId = null;
            if (municipioQuery.length > 0 && Array.isArray(municipioQuery) && municipioQuery[0].length > 0) {
                municipioId = municipioQuery[0][0].id_municipio; // Accede correctamente al id_municipio
            } else {
                console.error(`No se pudo obtener ID para el municipio: ${municipioName}`);
                continue; // Saltar a la siguiente iteración
            }

            // Insertar los datos en la tabla personas
            let idPersona;
            try {
                const personaData = {
                    identificacion: item.identificacion,
                    nombres: item.aprendiz,
                    correo: item.correo,
                    telefono: item.telefono,
                    password: await bcrypt.hash(item.identificacion.toString(), 10),
                    municipio: municipioId
                };

                console.log('Intentando insertar persona con los siguientes datos:', personaData);

                // Realizar la inserción
                // Realizar la inserción
                const insertPersona = await pool.query(
                    `INSERT INTO personas (identificacion, nombres, correo, telefono, password, rol, cargo, municipio, estado)
    VALUES (?, ?, ?, ?, ?, 'Aprendiz', 'Aprendiz', ?, 'activo')`,
                    [
                        personaData.identificacion,
                        personaData.nombres,
                        personaData.correo,
                        personaData.telefono,
                        personaData.password,
                        municipioId
                    ]
                );

                // Verificar el resultado de la inserción
                console.log('Resultado de la inserción de persona:', insertPersona);
                if (insertPersona[0].insertId) { // Accede al primer elemento del array
                    idPersona = insertPersona[0].insertId; // Asignar el ID aquí si la inserción fue exitosa
                    console.log(`Persona insertada con éxito, ID: ${idPersona}`);
                } else {
                    console.error(`No se pudo obtener ID de persona para ${personaData.nombres}`);
                }
            } catch (error) {
                console.error(`Error al insertar persona ${item.aprendiz}:`, error);
                continue; // Continúa con la siguiente iteración
            }

            // Verificar que idPersona no sea null o undefined antes de insertar en matriculas
            if (idPersona) {
                const matriculaData = {
                    ficha: item.ficha,
                    aprendiz: idPersona, // Aquí se utiliza el idPersona
                    estado: item.estado_matricula,
                    pendiente_tecnicos: item.pendiente_tecnicos,
                    pendiente_transversales: item.pendiente_transversales,
                    pendiente_ingles: item.pendiente_ingles
                };

                // Log de los datos que se van a insertar en la tabla matriculas
                console.log('Intentando insertar matrícula con los siguientes datos:', {
                    ficha: matriculaData.ficha,
                    aprendiz: matriculaData.aprendiz,
                    estado: matriculaData.estado,
                    pendiente_tecnicos: matriculaData.pendiente_tecnicos,
                    pendiente_transversales: matriculaData.pendiente_transversales,
                    pendiente_ingles: matriculaData.pendiente_ingles
                });

                // Insertar los datos en la tabla matriculas
                const insertMatricula = await pool.query(
                    `INSERT INTO matriculas (ficha, aprendiz, estado, pendiente_tecnicos, pendiente_transversales, pendiente_ingles)
                    VALUES (?, ?, ?, ?, ?, ?)`,
                    [
                        matriculaData.ficha,
                        matriculaData.aprendiz, // Se pasa el idPersona aquí
                        matriculaData.estado,
                        matriculaData.pendiente_tecnicos,
                        matriculaData.pendiente_transversales,
                        matriculaData.pendiente_ingles
                    ]
                );

                // Verificar el resultado de la inserción en matriculas
                if (insertMatricula.affectedRows === 0) {
                    console.error(`Error al insertar matrícula para aprendiz ID: ${idPersona}`);
                } else {
                    console.log(`Matrícula insertada con éxito para aprendiz ID: ${idPersona}`);
                }
            } else {
                console.error(`No se pudo obtener ID de persona para ${item.aprendiz}`);
            }
        }

        // Respuesta final
        res.status(200).json({ message: 'Datos importados con éxito.' });
    } catch (error) {
        console.error('Error al importar Excel:', error);
        res.status(500).json({ message: 'Hubo un error al importar los datos.' });
    }
};

import { pool } from './../database/conexion.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Obtener el directorio actual del archivo
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Función para listar seguimientos
export const listarSeguimiento = async (req, res) => {
    try {
        const sql = `SELECT * FROM seguimientos`;
        const [result] = await pool.query(sql);
        if (result.length > 0) {
            res.status(200).json(result);
        } else {
            res.status(404).json({ error: 'No hay seguimientos registrados' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor' + error });
    }
};

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "public/seguimientos");
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });
export const cargarSeguimiento = upload.single('seguimientoPdf');
export const listarSeguimientoAprendices = async (req, res) => {
    const { sigla } = req.params; 
    try {
        const sql = `
            SELECT
                p.identificacion AS identificacion,
                p.nombres AS nombres,
                f.codigo AS codigo,
                prg.sigla AS sigla,
                e.razon_social AS razon_social,
                s.id_seguimiento AS id_seguimiento,
                s.seguimiento AS seguimiento,
                s.fecha AS fecha,
                s.estado AS estado,  -- Agregamos la columna estado
                COUNT(b.id_bitacora) AS total_bitacoras,
                SUM(CASE WHEN b.pdf IS NOT NULL THEN 1 ELSE 0 END) AS bitacoras_con_pdf,
                (SUM(CASE WHEN b.pdf IS NOT NULL THEN 1 ELSE 0 END) / 12) * 100 AS porcentaje
            FROM
                seguimientos s
                LEFT JOIN productivas pr ON s.productiva = pr.id_productiva
                LEFT JOIN matriculas m ON pr.matricula = m.id_matricula
                LEFT JOIN personas p ON m.aprendiz = p.id_persona
                LEFT JOIN empresas e ON pr.empresa = e.id_empresa
                LEFT JOIN fichas f ON m.ficha = f.codigo
                LEFT JOIN programas prg ON f.programa = prg.id_programa
                LEFT JOIN bitacoras b ON b.seguimiento = s.id_seguimiento
            WHERE
                p.rol = 'Aprendiz'
            GROUP BY
                s.id_seguimiento, p.identificacion, s.seguimiento, s.fecha, f.codigo, prg.sigla, e.razon_social, s.estado
            ORDER BY
                p.identificacion, s.seguimiento;
        `;
        const [result] = await pool.query(sql);

        if (result.length > 0) {
            const aprendizMap = {};

            result.forEach(row => {
                if (!aprendizMap[row.identificacion]) {
                    aprendizMap[row.identificacion] = {
                        identificacion: row.identificacion,
                        nombres: row.nombres,
                        codigo: row.codigo,
                        sigla: row.sigla,
                        razon_social: row.razon_social,
                        id_seguimiento1: null,
                        id_seguimiento2: null,
                        id_seguimiento3: null,
                        seguimiento1: null,
                        seguimiento2: null,
                        seguimiento3: null,
                        estado1: null,  // Añadimos estado para cada seguimiento
                        estado2: null,
                        estado3: null,
                        porcentaje: 0,
                    };
                }

                if (row.seguimiento === '1') {
                    aprendizMap[row.identificacion].id_seguimiento1 = row.id_seguimiento;
                    aprendizMap[row.identificacion].seguimiento1 = row.fecha;
                    aprendizMap[row.identificacion].estado1 = row.estado;  // Guardamos el estado
                } else if (row.seguimiento === '2') {
                    aprendizMap[row.identificacion].id_seguimiento2 = row.id_seguimiento;
                    aprendizMap[row.identificacion].seguimiento2 = row.fecha;
                    aprendizMap[row.identificacion].estado2 = row.estado;
                } else if (row.seguimiento === '3') {
                    aprendizMap[row.identificacion].id_seguimiento3 = row.id_seguimiento;
                    aprendizMap[row.identificacion].seguimiento3 = row.fecha;
                    aprendizMap[row.identificacion].estado3 = row.estado;
                }

                aprendizMap[row.identificacion].porcentaje += (row.bitacoras_con_pdf / 12) * 100;
            });

            Object.values(aprendizMap).forEach(aprendiz => {
                aprendiz.porcentaje = Math.min(aprendiz.porcentaje, 100);
                aprendiz.porcentaje = Math.round(aprendiz.porcentaje) + '%';
            });

            const resultArray = Object.values(aprendizMap);
            res.status(200).json(resultArray);
        } else {
            res.status(404).json({ error: 'No hay seguimientos registrados para aprendices' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor: ' + error.message });
    }
};






// Función para registrar seguimientos
export const registrarSeguimiento = async (req, res) => {
    try {
        const seguimientoPdf = req.file ? req.file.originalname : null;
        const { fecha, productiva, instructor } = req.body;

        // Insertar tres seguimientos (1, 2, 3)
        const seguimientos = [
            { fecha, seguimiento: '1', estado: 1, pdf: seguimientoPdf, productiva, instructor },
            { fecha, seguimiento: '2', estado: 1, pdf: seguimientoPdf, productiva, instructor },
            { fecha, seguimiento: '3', estado: 1, pdf: seguimientoPdf, productiva, instructor }
        ];

        // Insertar todos los seguimientos en la base de datos
        await Promise.all(seguimientos.map(seg => 
            pool.query(
                'INSERT INTO seguimientos (fecha, seguimiento, estado, pdf, productiva, instructor) VALUES (?, ?, ?, ?, ?, ?)',
                [seg.fecha, seg.seguimiento, seg.estado, seg.pdf, seg.productiva, seg.instructor]
            )
        ));

        res.status(200).json({ message: 'Seguimientos registrados correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor: ' + error });
    }
};

/* Cargar PDF */
export const uploadPdfToSeguimiento = async (req, res) => {
    try {
        const { id_seguimiento } = req.params;  // Obtener el ID del seguimiento desde los parámetros de la URL
        const pdf = req.file?.originalname || null;  // Obtener el nombre del archivo PDF cargado

        if (!pdf) {
            return res.status(400).json({
                message: 'No se ha cargado ningún archivo'
            });
        }

        // Actualizar el campo 'pdf' en la tabla 'seguimientos' con la ruta o el nombre del archivo
        const sqlUpdateSeguimiento = `
            UPDATE seguimientos 
            SET pdf = ? 
            WHERE id_seguimiento = ?
        `;
        const [result] = await pool.query(sqlUpdateSeguimiento, [pdf, id_seguimiento]);

        if (result.affectedRows > 0) {
            res.status(200).json({
                message: 'PDF cargado exitosamente en el seguimiento'
            });
        } else {
            res.status(404).json({
                message: 'Seguimiento no encontrado'
            });
        }
    } catch (error) {
        res.status(500).json({
            message: 'Error del servidor: ' + error.message
        });
    }
};


// Función para actualizar seguimientos
export const actualizarSeguimiento = async (req, res) => {
    try {
        const { id } = req.params;
        const { fecha, seguimiento, productiva, instructor } = req.body;
        const seguimientoPdf = req.file ? req.file.originalname : null;

        const [anterior] = await pool.query(`SELECT * FROM seguimientos WHERE id_seguimiento = ?`, [id]);

        let sql = `UPDATE seguimientos SET
                    fecha = ?,
                    seguimiento = ?,
                    productiva = ?,
                    instructor = ?`;

        const params = [fecha || anterior[0].fecha, seguimiento || anterior[0].seguimiento, productiva || anterior[0].productiva, instructor || anterior[0].instructor];

        if (seguimientoPdf) {
            sql += `, pdf = ?`;
            params.push(seguimientoPdf);
        }

        sql += ` WHERE id_seguimiento = ?`;
        params.push(id);

        const [rows] = await pool.query(sql, params);

        if (rows.affectedRows > 0) {
            res.status(200).json({ message: 'Seguimiento actualizado correctamente' });
        } else {
            res.status(403).json({ error: 'Error al actualizar el seguimiento' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor: ' + error });
    }
};

// Función para aprobar seguimientos
export const aprobarSeguimiento = async (req, res) => {
    try {
      const { id_seguimiento } = req.params;
      const sql = 'UPDATE seguimientos SET estado = ? WHERE id_seguimiento = ?';
      const values = ['aprobado', id_seguimiento];
      const [result] = await pool.query(sql, values);
  
      if (result.affectedRows > 0) {
        res.status(200).json({ message: 'Estado actualizado a Aprobado' });
      } else {
        res.status(404).json({ message: 'Acta no encontrada' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error del servidor: ' + error.message });
    }
  };

// Función para rechazar seguimientos
export const rechazarSeguimiento = async (req, res) => {
    try {
      const { id_seguimiento } = req.params;
      const sql = 'UPDATE seguimientos SET estado = ? WHERE id_seguimiento = ?';
      const values = ['no aprobado', id_seguimiento];
      const [result] = await pool.query(sql, values);
  
      if (result.affectedRows > 0) {
        res.status(200).json({ message: 'Estado actualizado a No Aprobado' });
      } else {
        res.status(404).json({ message: 'Acta no encontrada' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error del servidor: ' + error.message });
    }
  };




export const descargarPdf = async (req, res) => {
    try {
        const id_seguimiento = decodeURIComponent(req.params.id_seguimiento);

        // Consultar la bitácora para obtener el nombre del archivo PDF
        const [result] = await pool.query('SELECT pdf FROM seguimientos WHERE id_seguimiento = ?', [id_seguimiento]);

        if (result.length === 0) {
            return res.status(404).json({
                message: 'Bitácora no encontrada'
            });
        }

        const pdfFileName = result[0].pdf;

        // Construir la ruta correcta hacia la carpeta public
        const filePath = path.resolve(__dirname, '../../public/seguimientos', pdfFileName);

        console.log(`Intentando acceder al archivo en: ${filePath}`); // Mensaje de depuración

        // Verificar si el archivo existe
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({
                message: `Archivo no encontrado en la ruta: ${filePath}`
            });
        }

        // Enviar el archivo como respuesta
        res.download(filePath, pdfFileName);
    } catch (error) {
        console.error('Error en el servidor:', error); // Mensaje de depuración
        res.status(500).json({
            message: 'Error en el servidor: ' + error.message
        });
    }
};



  export const listarEstadoSeguimiento = async (req, res) => {
    const { id_seguimiento } = req.params;
    try {
      const sql = `
        SELECT
          s.id_seguimiento AS id_seguimiento,
          s.seguimiento AS seguimiento,
          s.estado AS estado,
          s.pdf AS pdf
        FROM
          seguimientos s
        WHERE
          s.id_seguimiento = ?
      `;
      const [result] = await pool.query(sql, [id_seguimiento]);
  
      if (result.length > 0) {
        const estado = result[0];
        res.status(200).json(estado);
      } else {
        res.status(404).json({ error: 'Seguimiento no encontrado' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error del servidor: ' + error.message });
    }
  };
  
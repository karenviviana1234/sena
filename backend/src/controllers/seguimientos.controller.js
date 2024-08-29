import { pool } from './../database/conexion.js';
import multer from 'multer';

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
                COUNT(b.id_bitacora) AS total_bitacoras,
                COUNT(b.pdf) AS bitacoras_con_pdf,
                (COUNT(b.pdf) / 12) * 100 AS porcentaje
            FROM
                seguimientos s
                LEFT JOIN productiva pr ON s.productiva = pr.id_productiva
                LEFT JOIN matriculas m ON pr.matricula = m.id_matricula
                LEFT JOIN personas p ON m.aprendiz = p.id_persona
                LEFT JOIN empresa e ON pr.empresa = e.id_empresa
                LEFT JOIN fichas f ON m.ficha = f.codigo
                LEFT JOIN programas prg ON f.programa = prg.id_programa
                LEFT JOIN bitacoras b ON b.seguimiento = s.id_seguimiento
            WHERE
                p.rol = 'Aprendiz'
            GROUP BY
                s.id_seguimiento, p.identificacion
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
                        porcentaje: 0 // Inicializamos el porcentaje
                    };
                }

                if (row.seguimiento === '1') {
                    aprendizMap[row.identificacion].id_seguimiento1 = row.id_seguimiento;
                    aprendizMap[row.identificacion].seguimiento1 = row.fecha;
                } else if (row.seguimiento === '2') {
                    aprendizMap[row.identificacion].id_seguimiento2 = row.id_seguimiento;
                    aprendizMap[row.identificacion].seguimiento2 = row.fecha;
                } else if (row.seguimiento === '3') {
                    aprendizMap[row.identificacion].id_seguimiento3 = row.id_seguimiento;
                    aprendizMap[row.identificacion].seguimiento3 = row.fecha;
                }

                // Asignamos el porcentaje calculado
                aprendizMap[row.identificacion].porcentaje = row.porcentaje; 
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
        const { id } = req.params;
        const sql = `UPDATE seguimientos SET estado = 2 WHERE id_seguimiento = ?`;

        const [rows] = await pool.query(sql, [id]);

        if (rows.affectedRows > 0) {
            res.status(200).json({ message: 'Seguimiento aprobado correctamente' });
        } else {
            res.status(403).json({ error: 'Error al aprobar el seguimiento' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor: ' + error });
    }
};

// Función para rechazar seguimientos
export const rechazarSeguimiento = async (req, res) => {
    try {
        const { id } = req.params;
        const sql = `UPDATE seguimientos SET estado = 3 WHERE id_seguimiento = ?`;

        const [rows] = await pool.query(sql, [id]);

        if (rows.affectedRows > 0) {
            res.status(200).json({ message: 'Seguimiento rechazado correctamente' });
        } else {
            res.status(403).json({ error: 'Error al rechazar el seguimiento' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor: ' + error });
    }
};

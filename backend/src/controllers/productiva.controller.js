import { pool } from "../database/conexion.js";
import multer from "multer";
import { format, addMonths } from 'date-fns';


export const listarProductiva = async (req, res) => {
    try {
        let sql = `SELECT * FROM productivas`

        const [results] = await pool.query(sql)

        if(results.length>0){
            res.status(200).json(results)
        }else{
            res.status(404).json({
                message: 'No hay productiva registrada'
            })
        }
    } catch (error) {
        res.status(500).json({
            message: 'Error del servidor' + error
        })
    }
}

const storage = multer.diskStorage(
    {
        destination: function(req,file,cb){
            cb(null, "public/productivas")
        },
        filename: function(req,file,cb){
            cb(null, file.originalname)
        }
    }
)

const upload = multer({storage: storage})
export const productivaFiles = upload.fields([
    {name: 'acuerdo', maxCount: 1},
    {name: 'arl', maxCount: 1},
    {name: 'consulta', maxCount: 1}
])



export const registrarProductiva = async (req, res) => {
    try {
        const { matricula, empresa, fecha_inicio, fecha_fin, alternativa, aprendiz, instructor } = req.body;
        const acuerdo = req.files?.acuerdo?.[0]?.originalname || null;
        const arl = req.files?.arl?.[0]?.originalname || null;
        const consulta = req.files?.consulta?.[0]?.originalname || null;

        // Verificar que la matrícula existe en la tabla matriculas
        const sqlCheckMatricula = 'SELECT id_matricula FROM matriculas WHERE id_matricula =?';
        const [rowsMatricula] = await pool.query(sqlCheckMatricula, [matricula]);

        if (rowsMatricula.length === 0) {
            return res.status(400).json({
                message: 'La matrícula no existe'
            });
        }

        // Verificar si el aprendiz está disponible
        const sqlIsAprendizAvailable = 'SELECT COUNT(*) as count FROM actividades WHERE id_aprendiz = ? AND fecha BETWEEN ? AND ?';
        const [resultIsAprendizAvailable] = await pool.query(sqlIsAprendizAvailable, [aprendiz, fecha_inicio, fecha_fin]);

        if (resultIsAprendizAvailable[0].count > 0) {
            return res.status(400).json({
                message: 'El aprendiz ya tiene una actividad programada en este período'
            });
        }

        // Registrar etapa productiva
        const sqlProductiva = `
            INSERT INTO productivas 
            (matricula, empresa, fecha_inicio, fecha_fin, alternativa, estado, acuerdo, arl, consulta, aprendiz) 
            VALUES (?,?,?,?,?, 1,?,?,?,?)
        `;
        const [resultProductiva] = await pool.query(sqlProductiva, [
            matricula, empresa, fecha_inicio, fecha_fin, alternativa, acuerdo, arl, consulta, aprendiz
        ]);

        if (resultProductiva.affectedRows > 0) {
            const productivaId = resultProductiva.insertId;

            // Calcular fechas para seguimientos
            const fechaInicio = new Date(fecha_inicio);
            const fechaFin = new Date(fecha_fin);

            const fechaSeguimiento1 = addMonths(fechaInicio, 2);
            const fechaSeguimiento2 = addMonths(fechaInicio, 4);
            const fechaSeguimiento3 = fechaFin;

            // Insertar tres seguimientos asociados a la etapa productiva
            const sqlSeguimiento = `
                INSERT INTO seguimientos (fecha, seguimiento, estado, pdf, productiva, instructor) 
                VALUES (?, 1, 1,?,?,?),
                       (?, 2, 1,?,?,?),
                       (?, 3, 1,?,?,?)
            `;

            const [resultSeguimiento] = await pool.query(sqlSeguimiento, [
                format(fechaSeguimiento1, 'yyyy-MM-dd'), null, productivaId, instructor,
                format(fechaSeguimiento2, 'yyyy-MM-dd'), null, productivaId, instructor,
                format(fechaSeguimiento3, 'yyyy-MM-dd'), null, productivaId, instructor
            ]);

            if (resultSeguimiento.affectedRows >= 3) { 
                const seguimientoIds = [
                    resultSeguimiento.insertId,
                    resultSeguimiento.insertId + 1,
                    resultSeguimiento.insertId + 2
                ];

                // Insertar 4 bitácoras para cada seguimiento
                const sqlBitacoras = `
                    INSERT INTO bitacoras (fecha, bitacora, seguimiento, pdf, estado, instructor) 
                    VALUES 
                        (?, '1',?,?, 1,?),
                        (?, '2',?,?, 1,?),
                        (?, '3',?,?, 1,?),
                        (?, '4',?,?, 1,?),
                        (?, '5',?,?, 1,?),
                        (?, '6',?,?, 1,?),
                        (?, '7',?,?, 1,?),
                        (?, '8',?,?, 1,?),
                        (?, '9',?,?, 1,?),
                        (?, '10',?,?, 1,?),
                        (?, '11',?,?, 1,?),
                        (?, '12',?,?, 1,?)
                `;

                const [resultBitacoras] = await pool.query(sqlBitacoras, [
                    fecha_inicio, seguimientoIds[0], null, instructor,
                    fecha_inicio, seguimientoIds[0], null, instructor,
                    fecha_inicio, seguimientoIds[0], null, instructor,
                    fecha_inicio, seguimientoIds[0], null, instructor,
                    fecha_inicio, seguimientoIds[1], null, instructor,
                    fecha_inicio, seguimientoIds[1], null, instructor,
                    fecha_inicio, seguimientoIds[1], null, instructor,
                    fecha_inicio, seguimientoIds[1], null, instructor,
                    fecha_inicio, seguimientoIds[2], null, instructor,
                    fecha_inicio, seguimientoIds[2], null, instructor,
                    fecha_inicio, seguimientoIds[2], null, instructor
                ]);

                if (resultBitacoras.affectedRows >= 12) {
                    res.status(200).json({
                        message: 'Etapa productiva, seguimientos y bitácoras registrados correctamente'
                    });
                } else {
                    await pool.query('DELETE FROM seguimientos WHERE productivas =?', [productivaId]);
                    await pool.query('DELETE FROM productivas WHERE id_productiva =?', [productivaId]);
                    res.status(403).json({
                        message: 'Error al registrar las bitácoras'
                    });
                }
            } else {
                await pool.query('DELETE FROM productivas WHERE id_productiva =?', [productivaId]);
                res.status(403).json({
                    message: 'Error al registrar los seguimientos'
                });
            }
        } else {
            res.status(403).json({
                message: 'Error al registrar la etapa productiva'
            });
        }
    } catch (error) {
        res.status(500).json({
            message: 'Error del servidor:' + error.message
        });
    }
};






export const actualizarProductiva = async (req, res) => {
    try {
        const {id} = req.params
        const { matricula, empresa, fecha_inicio, fecha_fin, alternativa, aprendiz } = req.body
        let acuerdo = req.files && req.files.acuerdo ? req.files.acuerdo[0].originalname : null
        let arl = req.files && req.files.arl ? req.files.arl[0].originalname : null
        let consulta = req.files && req.files.consulta ? req.files.consulta[0].originalname : null

        const [anterior] = await pool.query('SELECT * FROM productivas WHERE id_productiva = ?', [id])

        let sql = `UPDATE productivas SET
                    matricula = ?,
                    empresa =?,
                    fecha_inicio =?,
                    fecha_fin =?,
                    alternativa =?,
                    aprendiz =?`

        const param = [matricula || anterior[0].matricula, empresa || anterior[0].empresa, fecha_inicio || anterior[0].fecha_inicio, fecha_fin || anterior[0].fecha_fin, alternativa || anterior[0].alternativa, aprendiz || anterior[0].aprendiz]

        if (acuerdo) {
            sql += `, acuerdo = ?`;
            param.push(acuerdo);
        }

        if (arl) {
            sql += `, arl = ?`;
            param.push(arl);
        }

        if (consulta) {
            sql += `, consulta = ?`;
            param.push(consulta);
        }

        sql += ` WHERE id_productiva = ?`;
        param.push(id);

        const [rows] = await pool.query(sql, param)

        if(rows.affectedRows>0){
            res.status(200).json({
                message: 'Etapa productiva actualizada correctamente'
            })
        }else{
            res.status(403).json({
                message: 'Error al actualizar la etapa productiva'
            })
        }
    } catch (error) {
        res.status(500).json({
            message: 'Error del servidor' + error
        })   
    }
}

export const renunciarProductiva = async (req, res) => {
    try {
        const {id} = req.params
        let sql = `UPDATE productivas SET estado = 2 WHERE id_productiva =?`

        const [rows] = await pool.query(sql, [id])

        if(rows.affectedRows>0){
            res.status(200).json({
                message: 'Etapa productiva renunciada correctamente'
            })
        }else{
            res.status(403).json({
                message: 'Error al renunciar la etapa productiva'
            })
        }
    } catch (error) {
        res.status(500).json({
            message: 'Error del servidor' + error
        })
    }
}

export const terminarProductiva = async(req, res) => {
    try {
        const {id} = req.params
        let sql = `UPDATE productivas SET estado = 3 WHERE id_productiva =?`

        const [rows] = await pool.query(sql, [id])

        if(rows.affectedRows>0){
            res.status(200).json({
                message: 'Etapa productiva finalizada correctamente'
            })
        }else{
            res.status(403).json({
                message: 'Error al finalizar la etapa productiva'
            })
        }
    } catch (error) {
        res.status(500).json({
            message: 'Error del servidor' + error
        })
    }
}
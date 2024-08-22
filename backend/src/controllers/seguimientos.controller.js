import { pool } from './../database/conexion.js'
import multer from 'multer'

export const listarSeguimiento = async (req, res) => {
    try {
        let sql =  `SELECT * FROM seguimientos`

        const [result] = await pool.query(sql)
        if(result.length>0){
            res.status(200).json(result)
        }else{
            res.status(404).json({
                error: 'No hay seguimientos registrados'
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
            cb(null, "public/seguimientos")
        },
        filename: function(req,file,cb){
            cb(null, file.originalname)
        }
    }
)

const upload = multer({storage: storage})
export const cargarSeguimiento = upload.single('seguimientoPdf')

export const listarSeguimientoAprendices = async (req, res) => {
    try {
        let sql = `
            SELECT
                p.identificacion AS identificacion,
                p.nombres AS nombres,
                f.codigo AS codigo,
                prg.sigla AS sigla, -- Agregamos la sigla del programa
                e.razon_social AS razon_social,
                DATE_ADD(pr.fecha_inicio, INTERVAL 2 MONTH) AS seguimiento1,
                DATE_ADD(pr.fecha_inicio, INTERVAL 4 MONTH) AS seguimiento2,
                pr.fecha_fin AS seguimiento3
            FROM
                seguimientos s
                LEFT JOIN productiva pr ON s.productiva = pr.id_productiva
                LEFT JOIN matriculas m ON pr.matricula = m.id_matricula
                LEFT JOIN personas p ON m.aprendiz = p.id_persona
                LEFT JOIN empresa e ON pr.empresa = e.id_empresa
                LEFT JOIN fichas f ON m.ficha = f.codigo
                LEFT JOIN programas prg ON f.programa = prg.id_programa -- Unión con la tabla de programas
            WHERE
                p.rol = 'Aprendiz'
            ORDER BY
                p.identificacion;
        `;

        const [result] = await pool.query(sql);

        if (result.length > 0) {
            res.status(200).json(result);
        } else {
            res.status(404).json({
                error: 'No hay seguimientos registrados para aprendices'
            });
        }
    } catch (error) {
        res.status(500).json({
            message: 'Error del servidor: ' + error.message
        });
    }
};

export const registrarSeguimiento = async(req, res) => {
    try {
        let seguimientoPdf = req.file.originalname
        const {fecha, seguimiento, productiva, instructor} = req.body

        let sql = `INSERT INTO seguimientos (fecha, seguimiento, estado, pdf, productiva, instructor) VALUES (?, ?, 1, ?, ?, ?)`

        const [rows] = await pool.query(sql, [fecha, seguimiento, seguimientoPdf, productiva, instructor])

        if(rows.affectedRows>0){
            res.status(200).json({
                message: 'Seguimiento registrado correctamente'
            })
        }else{
            res.status(403).json({
                error: 'Error al registrar el seguimiento'
            })
        }
    } catch (error) {
        res.status(500).json({
            message: 'Error del servidor' + error
        })
    }
}

export const actualizarSeguimiento = async(req, res) => {
    try {
        const {id} = req.params
        const {fecha, seguimiento, pdf, productiva, instructor} = req.body
        let seguimientoPdf = req.file ? req.file.originalname : null

        const [anterior] = await pool.query(`SELECT * FROM seguimientos WHERE id_seguimiento = ?`, [id])

        let sql = `UPDATE seguimientos SET
                    fecha = ?,
                    seguimiento =?,
                    productiva =?,
                    instructor =?`

        const params = [fecha || anterior[0].fecha, seguimiento || anterior[0].seguimiento, productiva || anterior[0].productiva, instructor || anterior[0].instructor]

        if (seguimientoPdf) {
            sql += `, pdf = ?`;
            params.push(seguimientoPdf);
        }

        sql += ` WHERE id_seguimiento = ?`;
        params.push(id);

        const [rows] = await pool.query(sql, params)

        if(rows.affectedRows>0){
            res.status(200).json({
                message: 'Seguimiento actualizado correctamente'
            })
        }else{
            res.status(403).json({
                error: 'Error al actualizar el seguimiento'
            })
        }
    } catch (error) {
        res.status(500).json({
            message: 'Error del servidor' + error
        })
    }
}

export const aprobarSeguimiento = async(req, res) => {
    try {
        const {id} = req.params
        let sql = `UPDATE seguimientos SET estado = 2 WHERE id_seguimiento = ?`

        const [rows] = await pool.query(sql, [id])

        if(rows.affectedRows>0){
            res.status(200).json({
                message: 'Seguimiento aprobado correctamente'
            })
        }else{
            res.status(403).json({
                error: 'Error al aprobar el seguimiento'
            })
        }
    } catch (error) {
        res.status(500).json({
            message: 'Error del servidor' + error
        })
    }
}

export const rechazarSeguimiento = async(req, res) => {
    try {
        const {id} = req.params
        let sql = `UPDATE seguimientos SET estado = 3 WHERE id_seguimiento = ?`

        const [rows] = await pool.query(sql, [id])

        if(rows.affectedRows>0){
            res.status(200).json({
                message: 'Seguimiento rechazado correctamente'
            })
        }else{
            res.status(403).json({
                error: 'Error al rechazar el seguimiento'
            })
        }
    } catch (error) {
        res.status(500).json({
            message: 'Error del servidor' + error
        })
    }
}
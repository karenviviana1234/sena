import { pool } from './../database/conexion.js'
import multer from 'multer'

export const listarBitacora = async (req, res) => {
    try {
        let sql = `SELECT * FROM bitacoras`

        const [result] = await pool.query(sql)
        if(result.length>0){
            res.status(200).json(result)
        }else{
            res.status(404).json({
                message: 'No hay bitacoras registradas'
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
            cb(null, "public/bitacoras")
        },
        filename: function(req,file,cb){
            cb(null, file.originalname)
        }
    }
)

const upload = multer({storage: storage})
export const cargarBitacora = upload.single('bitacoraPdf')

export const registrarBitacora = async (req, res) => {
    try {
        
        let bitacoraPdf = req.file.originalname
        const {fecha, bitacora, seguimiento, instructor} = req.body

        let sql = `INSERT INTO bitacoras (fecha, bitacora, seguimiento, pdf, estado, instructor) VALUES (?, ?, ?, ?, 1, ?)`

        const [rows] = await pool.query(sql, [fecha, bitacora, seguimiento, bitacoraPdf, instructor])

        if(rows.affectedRows>0){
            res.status(200).json({
                message: 'Bitacora registrada correctamente'
            })
        }else{
            res.status(403).json({
                message: 'Error al registrar bitacora'
            })
        }
    } catch (error) {
        res.status(500).json({
            message: 'Error del servidor' + error
        })
    }
}

export const actualizarBitacora = async (req, res) => {
    try {
        
        const {id} = req.params
        const {fecha, bitacora, seguimiento, instructor} = req.body
        let bitacoraPdf = req.file ? req.file.originalname : null

        const [anterior] = await pool.query(`SELECT * FROM bitacoras WHERE id_bitacora = ?`, [id])

        let sql = `UPDATE bitacoras SET
                    fecha = ?,
                    bitacora = ?,
                    seguimiento = ?,
                    instructor = ?`

        const params = [fecha || anterior[0].fecha, bitacora || anterior[0].bitacora, seguimiento || anterior[0].seguimiento, instructor || anterior[0].instructor]

        if (bitacoraPdf) {
            sql += `, pdf = ?`;
            params.push(bitacoraPdf);
        }

        sql += ` WHERE id_bitacora = ?`;
        params.push(id);

        const [rows] = await pool.query(sql, params)

        if(rows.affectedRows>0){
            res.status(200).json({
                message: 'Bitacora actualizada correctamente'
            })
        }else{
            res.status(403).json({
                message: 'Error al actualizar bitacora'
            })
        }
    } catch (error) {
        res.status(500).json({
            message: 'Error del servidor' + error
        })
    }
}

export const aprobarBitacora = async (req, res) => {
    try {
        
        const {id} = req.params
        let sql = `UPDATE bitacoras SET estado = 2 WHERE id_bitacora = ?`

        const [rows] = await pool.query(sql, [id])

        if(rows.affectedRows>0){
            res.status(200).json({
                message: 'Bitacora aprobada correctamente'
            })
        }else{
            res.status(403).json({
                message: 'Error al aprobar bitacora'
            })
        }
    } catch (error) {
        res.status(500).json({
            message: 'Error del servidor' + error
        })
    }
}

export const rechazarBitacora = async (req, res) => {
    try {
        
        const {id} = req.params
        let sql = `UPDATE bitacoras SET estado = 3 WHERE id_bitacora = ?`

        const [rows] = await pool.query(sql, [id])

        if(rows.affectedRows>0){
            res.status(200).json({
                message: 'Bitacora rechazada correctamente'
            })
        }else{
            res.status(403).json({
                message: 'Error al rechazar bitacora'
            })
        }
    } catch (error) {
        res.status(500).json({
            message: 'Error del servidor' + error
        })
    }
}
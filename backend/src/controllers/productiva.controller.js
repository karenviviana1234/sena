import { pool } from "../database/conexion.js";
import multer from "multer";

export const listarProductiva = async (req, res) => {
    try {
        let sql = `SELECT * FROM productiva`

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
            cb(null, "public/productiva")
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
        const { matricula, empresa, fecha_inicio, fecha_fin, alternativa, aprendiz } = req.body
        let acuerdo = req.files && req.files['acuerdo'] ? req.files['acuerdo'][0].originalname : null
        let arl = req.files && req.files['arl'] ? req.files['arl'][0].originalname : null
        let consulta = req.files && req.files['consulta'] ? req.files['consulta'][0].originalname : null

        let sql = `INSERT INTO productiva (matricula, empresa, fecha_inicio, fecha_fin, alternativa, estado, acuerdo, arl, consulta, aprendiz) VALUES (?, ?, ?, ?, ?, 1, ?, ?, ?, ?)`

        const [rows] = await pool.query(sql, [matricula, empresa, fecha_inicio, fecha_fin, alternativa, acuerdo, arl, consulta, aprendiz])

        if(rows.affectedRows>0){
            res.status(200).json({
                message: 'Etapa productiva registrada correctamente'
            })
        }else{
            res.status(403).json({
                message: 'Error al registrar la etapa productiva'
            })
        }
    } catch (error) {
        res.status(500).json({
            message: 'Error del servidor' + error
        })   
    }
}

export const actualizarProductiva = async (req, res) => {
    try {
        const {id} = req.params
        const { matricula, empresa, fecha_inicio, fecha_fin, alternativa, aprendiz } = req.body
        let acuerdo = req.files && req.files.acuerdo ? req.files.acuerdo[0].originalname : null
        let arl = req.files && req.files.arl ? req.files.arl[0].originalname : null
        let consulta = req.files && req.files.consulta ? req.files.consulta[0].originalname : null

        const [anterior] = await pool.query('SELECT * FROM productiva WHERE id_productiva = ?', [id])

        let sql = `UPDATE productiva SET
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
        let sql = `UPDATE productiva SET estado = 2 WHERE id_productiva =?`

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
        let sql = `UPDATE productiva SET estado = 3 WHERE id_productiva =?`

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
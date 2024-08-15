import { pool } from './../database/conexion.js'
import multer from 'multer'

const storage = multer.diskStorage(
    {
        destination: function(req,file,cb){
            cb(null, "public/actividades")
        },
        filename: function(req,file,cb){
            cb(null, file.originalname)
        }
    }
)

const upload = multer({storage: storage})
export const cargarImage = upload.single('foto')

export const registrarActividad = async (req, res) => {
    try {
        
        let foto = req.file.originalname
        const {descripcion, fecha, seguimiento, instructor} = req.body

        let sql = `INSERT INTO actividades (descripcion, fecha, foto, seguimiento, instructor) VALUES (?, ?, ?, ?, ?)`

        const [rows] = await pool.query(sql, [descripcion, fecha, foto, seguimiento, instructor])

        if(rows.affectedRows>0){
            res.status(200).json({
                message: 'Actividad registrada exitosamente'
            })
        }else{
            res.status(403).json({
                message: 'Error al registrar la actividad'
            })
        }
    } catch (error) {
        res.status(500).json({
            message: 'Error del servidor' + error
        })
    }
}

export const listarActividades = async (req, res) => {
    try {
        let sql = `SELECT * FROM actividades`

        const [results] = await pool.query(sql)
        if(results.length>0){
            res.status(200).json(results)
        }else{
            res.status(404).json({
                message: 'No hay actividades registradas'
            })
        }
    } catch (error) {
        res.status(500).json({
            message: 'Error del servidor' + error
        })
    }
}

export const actualizarActividad = async (req, res) => {
    try {
        
        const {id} = req.params
        let foto = req.file ? req.file.originalname : null;
        const {descripcion, fecha, seguimiento, instructor} = req.body

        const [anterior] = await pool.query(`SELECT * FROM actividades WHERE id_actividad = ?`, [id])

        let sql = `UPDATE actividades SET
                    descripcion = ?,
                    fecha =?,
                    seguimiento =?,
                    instructor =?`

        const params = [descripcion || anterior[0].descripcion, fecha || anterior[0].fecha, seguimiento || anterior[0].seguimiento, instructor || anterior[0].instructor]

        if (foto) {
            sql += `, foto = ?`;
            params.push(foto);
        }

        sql += ` WHERE id_actividad = ?`;
        params.push(id);
        
        const [rows] = await pool.query(sql, params)

        if(rows.affectedRows>0){
            res.status(200).json({
                message: 'Actividad actualizada exitosamente'
            })
        }else{
            res.status(403).json({
                message: 'Error al actualizar la actividad'
            })
        }
    } catch (error) {
        res.status(500).json({
            message: 'Error del servidor' + error
        })
    }
}

export const eliminarActividad = async (req, res) => {
    try {
        const {id} = req.params

        let sql = `DELETE FROM actividades WHERE id_actividad = ?`

        const [rows] = await pool.query(sql, [id])

        if(rows.affectedRows>0){
            res.status(200).json({
                message: 'Actividad eliminada exitosamente'
            })
        }else{
            res.status(403).json({
                message: 'Error al eliminar la actividad'
            })
        }
    } catch (error) {
        res.status(500).json({
            message: 'Error del servidor' + error
        })
    }
}
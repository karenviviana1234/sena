import multer from 'multer';
import { pool } from '../database/conexion.js';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/novedad');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });
export const cargarImage = upload.single('foto');

export const registrarNovedad = async (req, res) => {
    try {
        let foto = req.file ? req.file.originalname : null;
        let { descripcion, fecha, seguimiento, instructor } = req.body;

        // Validar que la fecha esté en el formato correcto 'YYYY-MM-DD'
        if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
            return res.status(400).json({ message: 'Formato de fecha incorrecto' });
        }

        if (!descripcion || !fecha || !seguimiento || !instructor) {
            return res.status(400).json({ message: 'Faltan datos en la solicitud' });
        }

        let sql = `INSERT INTO novedades (descripcion, fecha, foto, seguimiento, instructor) VALUES (?, ?, ?, ?, ?)`;
        const [rows] = await pool.query(sql, [descripcion, fecha, foto, seguimiento, instructor]);

        if (rows.affectedRows > 0) {
            res.status(200).json({
                message: 'Novedad registrada exitosamente'
            });
        } else {
            res.status(403).json({
                message: 'Error al registrar la novedad'
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error del servidor: ' + error.message
        });
    }
};


export const obtenerNovedadPorId = async (req, res) => {
    const { id_novedad } = req.params;
  
    try {
      const [rows] = await pool.query('SELECT * FROM Novedades WHERE id_novedad = ?', [id_novedad]);
  
      if (rows.length > 0) {
        res.json(rows[0]);
      } else {
        res.status(404).json({ message: 'Novedad no encontrada' });
      }
    } catch (error) {
      console.error('Error al obtener la novedad:', error);
      res.status(500).json({ message: 'Error al obtener la novedad', error });
    }
  };
  



export const listarnovedades = async (req, res) => {
    try {
        const { id_seguimiento } = req.params; // Obtén el ID del seguimiento desde los parámetros de la solicitud
        let sql = `SELECT * FROM novedades WHERE seguimiento = ?`;

        const [results] = await pool.query(sql, [id_seguimiento]);
        if (results.length > 0) {
            res.status(200).json(results);
        } else {
            res.status(404).json({
                message: 'No hay novedades registradas para este seguimiento'
            });
        }
    } catch (error) {
        res.status(500).json({
            message: 'Error del servidor: ' + error
        });
    }
}



export const actualizarNovedades = async (req, res) => {
    try {
        
        const {id} = req.params
        let foto = req.file ? req.file.originalname : null;
        const {descripcion, fecha, seguimiento, instructor} = req.body

        const [anterior] = await pool.query(`SELECT * FROM novedades WHERE id_seguimiento = ?`, [id])

        let sql = `UPDATE novedades SET
                    descripcion = ?,
                    fecha =?,
                    seguimiento =?,
                    instructor =?`

        const params = [descripcion || anterior[0].descripcion, fecha || anterior[0].fecha, seguimiento || anterior[0].seguimiento, instructor || anterior[0].instructor]

        if (foto) {
            sql += `, foto = ?`;
            params.push(foto);
        }

        sql += ` WHERE id_novedad = ?`;
        params.push(id);
        
        const [rows] = await pool.query(sql, params)

        if(rows.affectedRows>0){
            res.status(200).json({
                message: 'Novedad actualizada exitosamente'
            })
        }else{
            res.status(403).json({
                message: 'Error al actualizar la novedad'
            })
        }
    } catch (error) {
        res.status(500).json({
            message: 'Error del servidor' + error
        })
    }
}

export const eliminarNovedad = async (req, res) => {
    try {
        const {id} = req.params

        let sql = `DELETE FROM novedades WHERE id_actividad = ?`

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
import { pool } from './../database/conexion.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
<<<<<<< HEAD
import { format } from 'date-fns';
=======
>>>>>>> 2f26bb9f189b1ea7057056e49def6f0ea00a3a9a

// Obtener el directorio actual del archivo
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

<<<<<<< HEAD

const upload = multer({ storage: storage });
export const cargarBitacora = upload.single('bitacoraPdf');
=======
const upload = multer({storage: storage})
export const cargarBitacora = upload.single('bitacoraPdf')
>>>>>>> 2f26bb9f189b1ea7057056e49def6f0ea00a3a9a

export const registrarBitacora = async (req, res) => {
    try {
        const bitacoraPdf = req.file.originalname;
        const { bitacora, seguimiento, instructor } = req.body;

<<<<<<< HEAD
        // Obtener la fecha actual en formato local YYYY-MM-DD usando date-fns
        const fechaActual = format(new Date(), 'yyyy-MM-dd');
=======
        // Obtener la fecha actual en formato YYYY-MM-DD
        const fechaActual = new Date().toISOString().slice(0, 10);
>>>>>>> 2f26bb9f189b1ea7057056e49def6f0ea00a3a9a

        let sql = `INSERT INTO bitacoras (fecha, bitacora, seguimiento, pdf, estado, instructor) VALUES (?, ?, ?, ?, 1, ?)`;

        const [rows] = await pool.query(sql, [fechaActual, bitacora, seguimiento, bitacoraPdf, instructor]);

        if (rows.affectedRows > 0) {
            res.status(200).json({
                message: 'Bitacora registrada correctamente'
            });
        } else {
            res.status(403).json({
                message: 'Error al registrar bitacora'
            });
        }
    } catch (error) {
        res.status(500).json({
            message: 'Error del servidor: ' + error
        });
    }
};

export const uploadPdfToBitacoras = async (req, res) => {
    try {
        const { id_bitacora } = req.params;
        const pdf = req.file?.originalname || null;

        if (!pdf) {
            return res.status(400).json({
                message: 'No se ha cargado ningún archivo'
            });
        }

<<<<<<< HEAD
        // Obtener la fecha actual en formato local YYYY-MM-DD
        const fechaActual = format(new Date(), 'yyyy-MM-dd');

        // Actualizar el campo 'pdf' y 'fecha' en la tabla 'bitacoras'
        const sqlUpdateBitacora = `
            UPDATE bitacoras
            SET pdf = ?, fecha = ?
            WHERE id_bitacora = ?
        `;
        const [result] = await pool.query(sqlUpdateBitacora, [pdf, fechaActual, id_bitacora]);

        if (result.affectedRows > 0) {
            res.status(200).json({
                message: 'PDF cargado exitosamente en la bitacora'
            });
        } else {
            res.status(404).json({
                message: 'Bitacora no encontrada'
=======
        // Actualizar el campo 'pdf', 'fecha' e 'instructor' en la tabla 'bitacoras'
        const sqlUpdateBitacora = `
            UPDATE bitacoras
            SET pdf = ?, fecha = NOW(), instructor = ?
            WHERE id_bitacora = ?
        `;
        const [result] = await pool.query(sqlUpdateBitacora, [pdf, id_bitacora]);

        if (result.affectedRows > 0) {
            res.status(200).json({
                message: 'PDF cargado exitosamente en la bitácora'
            });
        } else {
            res.status(404).json({
                message: 'Bitácora no encontrada'
>>>>>>> 2f26bb9f189b1ea7057056e49def6f0ea00a3a9a
            });
        }
    } catch (error) {
        res.status(500).json({
            message: 'Error del servidor: ' + error.message
        });
    }
};

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
        
        const {id_bitacora} = req.params
        let sql = `UPDATE bitacoras SET estado = 2 WHERE id_bitacora = ?`

        const [rows] = await pool.query(sql, [id_bitacora])

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
        
        const {id_bitacora} = req.params
        let sql = `UPDATE bitacoras SET estado = 3 WHERE id_bitacora = ?`

        const [rows] = await pool.query(sql, [id_bitacora])

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

export const bitacoraSeguimiento = async (req, res) => {
    try {
<<<<<<< HEAD
        const {id} = req.params

        let sql = `SELECT * FROM bitacoras WHERE seguimiento = ?`
        const [result] = await pool.query(sql, [id])

        if(result.length>0){
            res.status(200).json(result)
        }else{
            res.status(404).json({
                message: 'No hay bitacoras asociadas al seguimiento'
            })
        }
    } catch (error) {
        res.status(500).json({
            message: 'Error del servidor' + error
        })
    }
}
=======
        const { id } = req.params;

        // Consulta con JOIN para obtener el nombre del instructor en lugar de su ID
        let sql = `
            SELECT b.id_bitacora, b.fecha, b.bitacora, b.seguimiento, b.pdf, b.estado, p.nombres as instructor 
            FROM bitacoras b
            JOIN personas p ON b.instructor = p.id_persona
            WHERE b.seguimiento = ?
        `;
        const [result] = await pool.query(sql, [id]);

        if (result.length > 0) {
            res.status(200).json(result);
        } else {
            res.status(404).json({
                message: 'No hay bitácoras asociadas al seguimiento'
            });
        }
    } catch (error) {
        res.status(500).json({
            message: 'Error del servidor: ' + error
        });
    }
};

>>>>>>> 2f26bb9f189b1ea7057056e49def6f0ea00a3a9a

export const buscarBitacora = async (req, res) => {
    try {
        const {id} = req.params
        let sql = `SELECT * FROM bitacoras WHERE id_bitacora =?`

        const [result] = await pool.query(sql, [id])

        if(result.length>0){
            res.status(200).json(result)
        }else{
            res.status(404).json({
                message: 'Bitacora no encontrada'
            })
        }
    } catch (error) {
        res.status(500).json({
            message: 'Error en el servidor' + error
        })
    }
}




export const descargarPdfBitacora = async (req, res) => {
    try {
        const id_bitacora = decodeURIComponent(req.params.id_bitacora);

        // Consultar la bitácora para obtener el nombre del archivo PDF
        const [result] = await pool.query('SELECT pdf FROM bitacoras WHERE id_bitacora = ?', [id_bitacora]);

        if (result.length === 0) {
            return res.status(404).json({
                message: 'Bitácora no encontrada'
            });
        }

        const pdfFileName = result[0].pdf;

        // Construir la ruta correcta hacia la carpeta public
        const filePath = path.resolve(__dirname, '../../public/bitacoras', pdfFileName);

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

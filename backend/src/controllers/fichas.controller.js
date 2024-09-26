import { pool } from '../database/conexion.js'

export const listarFichas = async (req, res) => {
    try {
        let sql = `SELECT f.*, p.nombre_programa 
                    FROM fichas f
                    INNER JOIN programas p ON f.programa = p.id_programa
                    `

        const [results] = await pool.query(sql)
        if(results.length>0){
            res.status(200).json(results)
        }else{
            res.status(404).json({
                message: 'No hay fichas registradas'
            })
        }
    } catch (error) {
        res.status(500).json({
            message: 'Error del servidor'
        })
    }
}

export const obtenerFichaPorId = async (req, res) => {
    try {
        const { id } = req.params

        let sql = `SELECT f.*, p.nombre_programa 
                   FROM fichas f
                   INNER JOIN programas p ON f.programa = p.id_programa
                   WHERE f.codigo = ?`

        const [results] = await pool.query(sql, [id])

        if (results.length > 0) {
            res.status(200).json(results[0])
        } else {
            res.status(404).json({
                message: 'Ficha no encontrada'
            })
        }
    } catch (error) {
        console.error('Error en obtenerFichaPorId:', error);
        res.status(500).json({
            message: 'Error del servidor',
            error: error.message
        })
    }
}

export const actualizarFicha = async (req, res) => {
    
    console.log('Actualizando ficha:', req.params.codigo);
    console.log('Datos recibidos:', req.body);

    const { codigo } = req.params;
    const { inicio_ficha, fin_lectiva, fin_ficha, programa, sede, estado } = req.body;

    const sql = `
        UPDATE fichas SET 
        inicio_ficha = ?,
        fin_lectiva = ?, 
        fin_ficha = ?, 
        programa = ?, 
        sede = ?, 
        estado = ?
        WHERE codigo = ?
    `;
    try {
        const [result] = await pool.query(sql, [inicio_ficha, fin_lectiva, fin_ficha, programa, sede, estado, codigo]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'No se encontró la ficha para actualizar' });
        }
        res.status(200).json({ message: 'Ficha actualizada con éxito' });
    } catch (error) {
        console.error('Error en actualizarFicha:', error);
        res.status(500).json({ message: 'Error del servidor', error: error.message });
    }
};
export const registrarFichas = async (req, res) => {
    try {
        const { codigo, inicio_ficha, fin_lectiva, fin_ficha, programa, sede, instructor_lider } = req.body; // Agregamos instructor_lider

        // Modificamos la consulta SQL para incluir instructor_lider
        let sql = `INSERT INTO fichas (codigo, inicio_ficha, fin_lectiva, fin_ficha, programa, sede, instructor_lider, estado) VALUES (?, ?, ?, ?, ?, ?, ?, 1)`;

        // Incluimos instructor_lider en el arreglo de parámetros de la consulta
        const [rows] = await pool.query(sql, [codigo, inicio_ficha, fin_lectiva, fin_ficha, programa, sede, instructor_lider]);

        if(rows.affectedRows > 0) {
            res.status(200).json({
                message: 'Ficha registrada con éxito'
            });
        } else {
            res.status(403).json({
                message: 'No fue posible registrar la ficha'
            });
        }
    } catch (error) {
        res.status(500).json({
            message: 'Error del servidor: ' + error
        });
    }
};



export const electivaFicha = async (req, res) => {
    try {
        const {id} = req.params
        let sql = `UPDATE fichas SET estado = 2 WHERE codigo =?`

        const [results] = await pool.query(sql, [id])

        if(results.affectedRows>0){
            res.status(200).json({
                message: 'Ficha en estado electiva'
            })
        }else{
            res.status(403).json({
                message: 'No fue posible cambiar a electiva la ficha'
            })
        }
    } catch (error) {
        res.status(500).json({
            message: 'Error del servidor' + error
        })
    }
}

export const finalizarFicha = async (req, res) => {
    try {
        const {id} = req.params
        let sql = `UPDATE fichas SET estado = 3 WHERE codigo =?`

        const [results] = await pool.query(sql, [id])

        if(results.affectedRows>0){
            res.status(200).json({
                message: 'Ficha finalizada con éxito'
            })
        }else{
            res.status(403).json({
                message: 'No fue posible finalizar la ficha'
            })
        }
    } catch (error) {
        res.status(500).json({
            message: 'Error del servidor' + error
        })
    }
}


export const listarCodigo = async (req, res) => {
    try {
        let sql = `SELECT codigo FROM fichas`;

        const [results] = await pool.query(sql);
        if (results.length > 0) {
            res.status(200).json(results);
        } else {
            res.status(404).json({
                message: 'No hay fichas registradas'
            });
        }
    } catch (error) {
        res.status(500).json({
            message: 'Error del servidor'
        });
    }
};
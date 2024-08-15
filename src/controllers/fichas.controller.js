import { pool } from './../database/conexion.js'

export const listarFichas = async (req, res) => {
    try {
        let sql = `SELECT * FROM fichas`

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

export const registrarFichas = async (req, res) => {
    try {
        const { codigo, inicio_ficha, fin_lectiva, fin_ficha, programa, sede } = req.body

        let sql = `INSERT INTO fichas (codigo, inicio_ficha, fin_lectiva, fin_ficha, programa, sede, estado) VALUES (?, ?, ?, ?, ?, ?, 1)`

        const [rows] = await pool.query(sql, [codigo, inicio_ficha, fin_lectiva, fin_ficha, programa, sede])

        if(rows.affectedRows>0){
            res.status(200).json({
                message: 'Ficha registrada con éxito'
            })
        }else{
            res.status(403).json({
                message: 'No fue posible registrar la ficha'
            })
        }
    } catch (error) {
        res.status(500).json({
            message: 'Error del servidor' + error
        })
    }
}

export const actualizarFicha = async (req, res) => {
    try {
        const {id} = req.params
        const { codigo, inicio_ficha, fin_lectiva, fin_ficha, programa, sede } = req.body

        let sql = `UPDATE fichas SET
                    codigo = ?,
                    inicio_ficha =?,
                    fin_lectiva =?,
                    fin_ficha =?,
                    programa =?,
                    sede =?
                    
                    WHERE codigo = ?`

        const [rows] = await pool.query(sql, [codigo, inicio_ficha, fin_lectiva, fin_ficha, programa, sede, id])

        if(rows.affectedRows>0){
            res.status(200).json({
                message: 'Ficha actualizada con éxito'
            })
        }else{
            res.status(403).json({
                message: 'No fue posible actualizar la ficha'
            })
        }
    } catch (error) {
        res.status(500).json({
            message: 'Error del servidor' + error
        })
    }
}

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
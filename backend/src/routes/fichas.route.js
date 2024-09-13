import Router from 'express'
import { listarFichas, registrarFichas, actualizarFicha, electivaFicha, finalizarFicha, listarCodigo } from '../controllers/fichas.controller.js'
import { validarToken } from './../controllers/seguridad.controller.js' 

const rutaFichas = Router()

rutaFichas.get('/listar', validarToken, listarFichas)
rutaFichas.get('/listarC', validarToken, listarCodigo)
rutaFichas.post('/registrar', validarToken, registrarFichas)
rutaFichas.put('/actualizar/:id', validarToken, actualizarFicha)
rutaFichas.put('/electiva/:id', validarToken, electivaFicha)
rutaFichas.put('/finalizar/:id', validarToken, finalizarFicha)

export default rutaFichas
//modificaciones
import Router from 'express'
import { listarFichas, registrarFichas, actualizarFicha, electivaFicha, finalizarFicha, listarCodigo, obtenerFichaPorId, finFicha } from '../controllers/fichas.controller.js'
import { validarToken } from './../controllers/seguridad.controller.js' 

const rutaFichas = Router()

rutaFichas.get('/listar', validarToken, listarFichas)
rutaFichas.get('/listar/:id', validarToken, obtenerFichaPorId)
rutaFichas.get('/listarC', validarToken, listarCodigo)
rutaFichas.post('/registrar', validarToken, registrarFichas)
rutaFichas.put('/actualizar/:codigo', validarToken, actualizarFicha)
rutaFichas.put('/electiva/:id', validarToken, electivaFicha)
rutaFichas.put('/finalizar/:id', validarToken, finalizarFicha)
rutaFichas.post('/fin/:codigo', validarToken, finFicha)

export default rutaFichas
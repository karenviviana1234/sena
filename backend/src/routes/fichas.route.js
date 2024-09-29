//modificaciones
import Router from 'express'
<<<<<<< HEAD
import { listarFichas, registrarFichas, actualizarFicha, electivaFicha, finalizarFicha, listarCodigo, obtenerFichaPorId, finFicha } from '../controllers/fichas.controller.js'
=======
import { listarFichas, registrarFichas, actualizarFicha, electivaFicha, finalizarFicha, listarCodigo } from '../controllers/fichas.controller.js'
>>>>>>> 2f26bb9f189b1ea7057056e49def6f0ea00a3a9a
import { validarToken } from './../controllers/seguridad.controller.js' 

const rutaFichas = Router()

<<<<<<< HEAD
rutaFichas.get('/listar', validarToken, listarFichas)
rutaFichas.get('/listar/:id', validarToken, obtenerFichaPorId)
rutaFichas.get('/listarC', validarToken, listarCodigo)
rutaFichas.post('/registrar', validarToken, registrarFichas)
rutaFichas.put('/actualizar/:codigo', validarToken, actualizarFicha)
rutaFichas.put('/electiva/:id', validarToken, electivaFicha)
rutaFichas.put('/finalizar/:id', validarToken, finalizarFicha)
rutaFichas.post('/fin/:codigo', validarToken, finFicha)
=======
rutaFichas.get('/listar', /* validarToken, */ listarFichas)
rutaFichas.get('/listarC', validarToken, listarCodigo)
rutaFichas.post('/registrar', validarToken, registrarFichas)
rutaFichas.put('/actualizar/:id', validarToken, actualizarFicha)
rutaFichas.put('/electiva/:id', validarToken, electivaFicha)
rutaFichas.put('/finalizar/:id', validarToken, finalizarFicha)
>>>>>>> 2f26bb9f189b1ea7057056e49def6f0ea00a3a9a

export default rutaFichas
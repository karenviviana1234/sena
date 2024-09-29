import Router from 'express'
import { listarSeguimiento, registrarSeguimiento, actualizarSeguimiento, cargarSeguimiento, aprobarSeguimiento, rechazarSeguimiento, listarSeguimientoAprendices, uploadPdfToSeguimiento, descargarPdf, listarEstadoSeguimiento } from '../controllers/seguimientos.controller.js'
import { validarToken } from './../controllers/seguridad.controller.js'

const rutaSeguimiento = Router()

rutaSeguimiento.get('/listar',validarToken,  listarSeguimiento)
<<<<<<< HEAD
rutaSeguimiento.get('/listarA', validarToken,   listarSeguimientoAprendices)
=======
rutaSeguimiento.get('/listarA',  listarSeguimientoAprendices)
>>>>>>> 2f26bb9f189b1ea7057056e49def6f0ea00a3a9a
rutaSeguimiento.post('/registrar', validarToken, cargarSeguimiento, registrarSeguimiento)
rutaSeguimiento.post('/cargarPdf/:id_seguimiento', validarToken, cargarSeguimiento, uploadPdfToSeguimiento)
rutaSeguimiento.put('/actualizar/:id', validarToken, cargarSeguimiento, actualizarSeguimiento)
rutaSeguimiento.put('/aprobar/:id_seguimiento', validarToken, aprobarSeguimiento)
rutaSeguimiento.put('/rechazar/:id_seguimiento', validarToken, rechazarSeguimiento)
rutaSeguimiento.get('/descargarPdf/:id_seguimiento', validarToken, descargarPdf)
rutaSeguimiento.get('/listarEstado/:id_seguimiento', validarToken, listarEstadoSeguimiento)



export default rutaSeguimiento
















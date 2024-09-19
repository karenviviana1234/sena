import Router from 'express'
import { listarSeguimiento, registrarSeguimiento, actualizarSeguimiento, cargarSeguimiento, aprobarSeguimiento, rechazarSeguimiento, listarSeguimientoAprendices, uploadPdfToSeguimiento, descargarPdf } from '../controllers/seguimientos.controller.js'
import { validarToken } from './../controllers/seguridad.controller.js'

const rutaSeguimiento = Router()

rutaSeguimiento.get('/listar',validarToken,  listarSeguimiento)
rutaSeguimiento.get('/listarA',  listarSeguimientoAprendices)
rutaSeguimiento.post('/registrar', validarToken, cargarSeguimiento, registrarSeguimiento)
rutaSeguimiento.post('/cargarPdf/:id_seguimiento', validarToken, cargarSeguimiento, uploadPdfToSeguimiento)
rutaSeguimiento.put('/actualizar/:id', validarToken, cargarSeguimiento, actualizarSeguimiento)
rutaSeguimiento.put('/aprobar/:id', validarToken, aprobarSeguimiento)
rutaSeguimiento.put('/rechazar/:id', validarToken, rechazarSeguimiento)
rutaSeguimiento.post('/descargarPdf/', validarToken, descargarPdf)


export default rutaSeguimiento
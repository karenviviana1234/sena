import Router from 'express'
import { listarSeguimiento, registrarSeguimiento, actualizarSeguimiento, cargarSeguimiento, aprobarSeguimiento, rechazarSeguimiento } from '../controllers/seguimientos.controller.js'
import { validarToken } from './../controllers/seguridad.controller.js'

const rutaSeguimiento = Router()

rutaSeguimiento.get('/listar', validarToken, listarSeguimiento)
rutaSeguimiento.post('/registrar', validarToken, cargarSeguimiento, registrarSeguimiento)
rutaSeguimiento.put('/actualizar/:id', validarToken, cargarSeguimiento, actualizarSeguimiento)
rutaSeguimiento.put('/aprobar/:id', validarToken, aprobarSeguimiento)
rutaSeguimiento.put('/rechazar/:id', validarToken, rechazarSeguimiento)

export default rutaSeguimiento


import Router from 'express'
import { registrarasignacion,actualizarasignacion,buscarasignacion,listarasignaciones } from '../controllers/asignacion.controller.js'
import { validarToken } from '../controllers/seguridad.controller.js'

const asignacioneRuta = Router()

asignacioneRuta.get('/listar',  listarasignaciones)
asignacioneRuta.post('/registrar',   registrarasignacion)
asignacioneRuta.put('/actualizar/:id',  actualizarasignacion)
asignacioneRuta.get('/buscar/:id', validarToken, buscarasignacion)

export default asignacioneRuta


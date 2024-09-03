import Router from 'express'
import { listarBitacora, registrarBitacora, actualizarBitacora, aprobarBitacora, cargarBitacora, rechazarBitacora, uploadPdfToBitacoras, bitacoraSeguimiento, buscarBitacora } from '../controllers/bitacoras.controller.js'
import { validarToken } from '../controllers/seguridad.controller.js'

const rutaBitacoras = Router()

rutaBitacoras.get('/listar', /* validarToken, */ listarBitacora)
rutaBitacoras.post('/registrar', /* validarToken,  */cargarBitacora, registrarBitacora)

rutaBitacoras.post('/cargarpdf/:id_bitacora', /* validarToken,  */cargarBitacora,uploadPdfToBitacoras)

rutaBitacoras.put('/actualizar/:id', validarToken, cargarBitacora, actualizarBitacora)
rutaBitacoras.put('/aprobar/:id', validarToken, aprobarBitacora)
rutaBitacoras.put('/rechazar/:id', validarToken, rechazarBitacora)
rutaBitacoras.get('/bitacorasSeguimiento/:id',/*  validarToken, */ bitacoraSeguimiento)
rutaBitacoras.get('/buscar/:id', validarToken, buscarBitacora)

export default rutaBitacoras
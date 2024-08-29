import Router from 'express'
import { listarBitacora, registrarBitacora, actualizarBitacora, aprobarBitacora, cargarBitacora, rechazarBitacora, uploadPdfToBitacoras } from '../controllers/bitacoras.controller.js'
import { validarToken } from '../controllers/seguridad.controller.js'

const rutaBitacoras = Router()

rutaBitacoras.get('/listar', /* validarToken, */ listarBitacora)
rutaBitacoras.post('/registrar', /* validarToken,  */cargarBitacora, registrarBitacora)

rutaBitacoras.post('/cargarpdf/:id_bitacora', /* validarToken,  */cargarBitacora,uploadPdfToBitacoras)

rutaBitacoras.put('/actualizar/:id', validarToken, cargarBitacora, actualizarBitacora)
rutaBitacoras.put('/aprobar/:id', validarToken, aprobarBitacora)
rutaBitacoras.put('/rechazar/:id', validarToken, rechazarBitacora)

export default rutaBitacoras
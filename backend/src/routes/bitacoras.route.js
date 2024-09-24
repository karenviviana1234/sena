import Router from 'express'
import { listarBitacora, registrarBitacora, actualizarBitacora, aprobarBitacora, cargarBitacora, rechazarBitacora, uploadPdfToBitacoras, bitacoraSeguimiento, buscarBitacora, descargarPdfBitacora } from '../controllers/bitacoras.controller.js'
import { validarToken } from '../controllers/seguridad.controller.js'

const rutaBitacoras = Router()

rutaBitacoras.get('/listar', validarToken, listarBitacora)
rutaBitacoras.post('/registrar', /* validarToken, */ cargarBitacora, registrarBitacora)

rutaBitacoras.post('/cargarpdf/:id_bitacora', /* validarToken, */ cargarBitacora,uploadPdfToBitacoras)

rutaBitacoras.put('/actualizar/:id', validarToken, cargarBitacora, actualizarBitacora)
<<<<<<< HEAD
rutaBitacoras.put('/aprobar/:id', validarToken, aprobarBitacora)
rutaBitacoras.put('/rechazar/:id', validarToken, rechazarBitacora)
rutaBitacoras.get('/bitacorasSeguimiento/:id', /* validarToken, */ bitacoraSeguimiento)
=======
rutaBitacoras.put('/aprobar/:id_bitacora', validarToken, aprobarBitacora)
rutaBitacoras.put('/rechazar/:id_bitacora', validarToken, rechazarBitacora)
rutaBitacoras.get('/bitacorasSeguimiento/:id', validarToken, bitacoraSeguimiento)
>>>>>>> 8bcf30ec146c5c21fff989e545aab2c4e844c282
rutaBitacoras.get('/buscar/:id', validarToken, buscarBitacora)
rutaBitacoras.get('/download/:id_bitacora', descargarPdfBitacora);

export default rutaBitacoras
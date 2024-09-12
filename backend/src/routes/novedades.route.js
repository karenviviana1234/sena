import { Router } from 'express';
import { 
  registrarNovedad, 
  actualizarNovedades, 
  eliminarNovedad, 
  listarnovedades, 
  cargarImage,
  obtenerNovedadPorId// Debes crear esta función en tu controlador
} from '../controllers/novedades.controller.js';
import { validarToken } from '../controllers/seguridad.controller.js';

const rutaNovedades = Router();

// Nueva ruta para obtener una novedad por su ID
rutaNovedades.get('/listarN/:id_novedad', validarToken, obtenerNovedadPorId);

rutaNovedades.get('/listar/:id_seguimiento', validarToken, listarnovedades);
rutaNovedades.post('/registrar', validarToken, cargarImage, registrarNovedad);
rutaNovedades.put('/actualizar/:id', validarToken, cargarImage, actualizarNovedades);
rutaNovedades.delete('/eliminar/:id', validarToken, eliminarNovedad);

export default rutaNovedades;

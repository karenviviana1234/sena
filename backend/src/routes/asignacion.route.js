import { Router } from "express";
<<<<<<< HEAD
import { listarasignaciones, registrarasignacion, actualizarasignacion, buscarasignacion, eliminarAsignacion } from "../controllers/asignacion.controller.js";
=======
import { listarasignaciones, registrarasignacion, actualizarasignacion, buscarasignacion } from "../controllers/asignacion.controller.js";
>>>>>>> 2f26bb9f189b1ea7057056e49def6f0ea00a3a9a
import { validarToken } from "../controllers/seguridad.controller.js";

const rutaAsignacion = Router();

<<<<<<< HEAD
rutaAsignacion.get("/listar", validarToken, listarasignaciones);
rutaAsignacion.post("/registrar", validarToken, registrarasignacion);
rutaAsignacion.put("/actualizar/:id_asignacion", validarToken, actualizarasignacion);
rutaAsignacion.delete("/eliminar/:id_asignacion", validarToken, eliminarAsignacion);
rutaAsignacion.get("/buscar/:id_asignacion", validarToken, buscarasignacion);
=======
rutaAsignacion.get("/listar",validarToken,listarasignaciones);
rutaAsignacion.post("/registrar", validarToken,registrarasignacion);
rutaAsignacion.put("/actualizar/:id", validarToken, actualizarasignacion);
rutaAsignacion.get("/buscar/:id", validarToken, buscarasignacion);
>>>>>>> 2f26bb9f189b1ea7057056e49def6f0ea00a3a9a


export default rutaAsignacion;
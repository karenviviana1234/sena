import { Router } from "express";
import { listarasignaciones, registrarasignacion, actualizarasignacion, buscarasignacion } from "../controllers/asignacion.controller.js";
import { validarToken } from "../controllers/seguridad.controller.js";

const rutaAsignacion = Router();

rutaAsignacion.get("/listar", validarToken, listarasignaciones);
rutaAsignacion.post("/registrar", validarToken, registrarasignacion);
rutaAsignacion.put("/actualizar/:id", validarToken, actualizarasignacion);
rutaAsignacion.get("/buscar/:id", validarToken, buscarasignacion);


export default rutaAsignacion;
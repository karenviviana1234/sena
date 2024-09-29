import { Router } from "express";
<<<<<<< HEAD
import { ActualizarHorarios, CrearHorario, DesactivarHorario, listarHorarios } from "../controllers/Horarios.js";
import { validarToken } from "../controllers/seguridad.controller.js";

export const rutaHorarios = Router();

rutaHorarios.get("/listar", validarToken, listarHorarios);
rutaHorarios.post("/registrar", validarToken, CrearHorario);
rutaHorarios.put("/actualizar/:id_horario", validarToken, ActualizarHorarios);
rutaHorarios.post("/desactivar/:id_horario", validarToken, DesactivarHorario);

=======
import { listarHorarios } from "../controllers/Horarios.js";

export const rutaHorarios = Router();

rutaHorarios.get('/listar', listarHorarios)
>>>>>>> 2f26bb9f189b1ea7057056e49def6f0ea00a3a9a

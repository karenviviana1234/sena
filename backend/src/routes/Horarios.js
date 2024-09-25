import { Router } from "express";
import { ActualizarHorarios, CrearHorario, listarHorarios } from "../controllers/Horarios.js";
import { validarToken } from "../controllers/seguridad.controller.js";

export const rutaHorarios = Router();

rutaHorarios.get("/listar", validarToken, listarHorarios);
rutaHorarios.post("/registrar", validarToken, CrearHorario);
rutaHorarios.put("/actualizar/:id_horario", validarToken, ActualizarHorarios);


import { Router } from "express";
import { listarHorarios } from "../controllers/Horarios.js";

export const rutaHorarios = Router();

rutaHorarios.get('/listar', listarHorarios)

import { Router } from "express";
import { listarEmpresas, registrarEmpresas, actualizarEmpresas, inactivarEmpresa, activarEmpresa } from "../controllers/empresas.controller.js";
import { validarToken } from "../controllers/seguridad.controller.js";

const rutaEmpresas = Router();

rutaEmpresas.get("/listar", validarToken, listarEmpresas);
rutaEmpresas.post("/registrar", validarToken, registrarEmpresas);
<<<<<<< HEAD
rutaEmpresas.put("/actualizar/:id_empresa", validarToken, actualizarEmpresas);
rutaEmpresas.post("/inactivar/:id_empresa", validarToken, inactivarEmpresa);
=======
rutaEmpresas.put("/actualizar/:id", validarToken, actualizarEmpresas);
rutaEmpresas.put("/inactivar/:id", validarToken, inactivarEmpresa);
>>>>>>> 2f26bb9f189b1ea7057056e49def6f0ea00a3a9a
rutaEmpresas.put("/activar/:id", validarToken, activarEmpresa);

export default rutaEmpresas;
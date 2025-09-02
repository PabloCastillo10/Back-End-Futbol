import { Router } from "express";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { Login, Register } from "./auth.controller.js";

const router = Router();

router.post("/login", Login);
router.post("/register", Register);

export default router;
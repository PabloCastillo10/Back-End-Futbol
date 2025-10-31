import { Router } from "express";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { createNotica, getAllNoticias, updateNoticias, deleteNoticia, getUltimasNoticias } from "./noticias.controller.js";
import { uploadImage } from "../middlewares/multer.js";

const router = Router();

router.post("/create", validarJWT, uploadImage, createNotica);
router.get("/all", getAllNoticias);
router.get("/ultimas", getUltimasNoticias);
router.put("/:id", validarJWT, uploadImage, updateNoticias);
router.delete("/:id", validarJWT, deleteNoticia);

export default router
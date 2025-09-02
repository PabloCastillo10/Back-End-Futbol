import { Router } from "express";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { createLeague, getAllLeagues, getLeagueByName, updateLeague, deleteLeague } from "./league.controller.js";
import {uploadImage} from "../middlewares/multer.js";

const router = Router();

router.post("/create", validarJWT,uploadImage, createLeague);
router.get("/all",  getAllLeagues);
router.get("/:name",  getLeagueByName);
router.put("/:id", validarJWT, uploadImage, updateLeague);
router.delete("/:id", validarJWT, deleteLeague);

export default router;
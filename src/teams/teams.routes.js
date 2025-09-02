import { Router } from "express";
import { createTeam, getAllTeams, getTeamsByName, getTeamsLeague, updateTeams, deletedTeams } from "./teams.controller.js";
import { uploadImage } from "../middlewares/multer.js";
import { validarJWT } from "../middlewares/validar-jwt.js";

const router = Router();

router.post("/create", validarJWT, uploadImage, createTeam)
router.get("/all", getAllTeams);
router.get("/:name", getTeamsByName);
router.get("/search/:name", getTeamsLeague)
router.put("/:id", validarJWT, uploadImage, updateTeams);
router.delete("/:id", validarJWT, deletedTeams)

export default router;
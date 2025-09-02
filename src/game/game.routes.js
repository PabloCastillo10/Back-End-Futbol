import { Router } from "express";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { createGame, getGames, getGameByName, listGameByLeague, updateGame, createGameResult, getSearchJornada, getTableLeague, getTableLeagueByTeam } from "./game.controller.js";

const router = Router();

router.post("/create", validarJWT, createGame);
router.get("/all", getGames);
router.get("/:equipoLocal", getGameByName);
router.get("/all/:league", listGameByLeague);
router.get("/search/:jornada/:league", getSearchJornada);
router.get("/table/:league", getTableLeague);
router.get("/table/:league/:team", getTableLeagueByTeam);
router.put("/:id", validarJWT,updateGame);
router.put("/result/:id", validarJWT, createGameResult);

export default router;